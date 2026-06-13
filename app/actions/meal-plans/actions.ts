'use server';

import { auth } from '@/lib/auth';
import db from '@/lib/db';
import { generateMealPlan as deepSeekGenerate } from '@/lib/deepseek';
import { MealPlanGenerationSchema } from '@/lib/validators';
import { revalidatePath } from 'next/cache';

import { generationRateLimit } from '@/lib/rate-limit';

export async function generateMealPlan(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  // Rate Limiting Check
  const { success: limitSuccess } = await generationRateLimit.limit(session.user.id);
  if (!limitSuccess) {
    return { success: false, error: 'Too many meal plans generated recently. Please try again later.' };
  }

  const budget = parseFloat(formData.get('budget') as string);
  const ingredients = formData.get('ingredients') as string;

  const validatedFields = MealPlanGenerationSchema.safeParse({ budget, ingredients });

  if (!validatedFields.success) {
    return { success: false, error: 'Invalid input data.' };
  }

  const householdSize = (session.user as any).householdSize || '3-4';
  const primaryGoal = (session.user as any).primaryGoal || 'save-money';
  const budgetFriendly = formData.get('budgetFriendly') === 'true';

  // Hardcoded Budget Reality Check
  // Determine an absolute minimum realistic cost per individual meal portion (e.g., ₦200)
  const MIN_COST_PER_PORTION = 200;
  
  const getHouseholdMultiplier = (size: string) => {
    if (size.includes('-')) return parseInt(size.split('-')[0], 10);
    if (size.includes('+')) return parseInt(size.replace('+', ''), 10);
    return parseInt(size, 10) || 1;
  };

  const householdMultiplier = getHouseholdMultiplier(householdSize);
  const totalWeeklyPortions = 21 * householdMultiplier; // 3 meals * 7 days * people
  const minimumRealisticBudget = totalWeeklyPortions * MIN_COST_PER_PORTION;

  if (budget < minimumRealisticBudget) {
    return { 
      success: false, 
      error: `₦${budget.toLocaleString()} is insufficient. Your household size (${householdSize}) requires a minimum budget of ₦${minimumRealisticBudget.toLocaleString()} for a 7-day meal plan.` 
    };
  }

  try {
    const mealPlan = await deepSeekGenerate(budget, ingredients, householdSize, primaryGoal, budgetFriendly);

    // Server-side Budget Intelligence Layer
    // Hardcoded conservative floor prices (NGN) for common Nigerian market items, 2024-2026.
    // If the AI's estimatedCost is suspiciously low vs. the number of shopping items,
    // we override budgetStatus to EXCEEDS_BUDGET to protect the user.
    const PRICE_FLOORS: Record<string, number> = {
      rice: 1500, beans: 1000, garri: 600, yam: 3500, plantain: 700,
      bread: 1200, semolina: 1500, potato: 1500,
      chicken: 4500, beef: 5000, eggs: 3000, fish: 2000, stockfish: 2500,
      mackerel: 1500, sardines: 1200,
      tomatoes: 1500, onions: 1200, pepper: 1000, habanero: 800,
      vegetables: 700, okra: 700, coconut: 800,
      egusi: 2500, ogbono: 2000, crayfish: 1500,
      'palm oil': 2000, 'groundnut oil': 2500, seasoning: 600,
    };

    const getFloorPrice = (item: string): number => {
      const lower = item.toLowerCase();
      for (const [key, price] of Object.entries(PRICE_FLOORS)) {
        if (lower.includes(key)) return price;
      }
      return 800; // default floor for unrecognized items
    };

    const shoppingList = mealPlan.shoppingList as Array<{ item: string; quantity: string }>;
    const minRealisticCost = shoppingList.reduce((total, entry) => {
      return total + getFloorPrice(entry.item);
    }, 0);

    // If the AI's estimate is less than 70% of our minimum floor calculation, it's unreliable.
    // Override the budget status to protect the user.
    let correctedBudgetStatus = mealPlan.budgetStatus;
    const aiUnderestimatedByPercent = mealPlan.estimatedCost < minRealisticCost * 0.7;
    if (aiUnderestimatedByPercent && minRealisticCost > budget) {
      correctedBudgetStatus = 'EXCEEDS_BUDGET';
    } else if (aiUnderestimatedByPercent && minRealisticCost > budget * 0.8) {
      correctedBudgetStatus = 'APPROACHING_BUDGET';
    }

    // Build an estimated cost range: floor is our server-calculated minimum,
    // ceiling adds a realistic 35% market variance (haggling, season, location).
    const estimatedCostRange = {
      min: minRealisticCost,
      max: Math.round(minRealisticCost * 1.35),
    };

    const correctedPlan = { 
      ...mealPlan, 
      budgetStatus: correctedBudgetStatus,
      estimatedCostRange,
    };

    // Save to database as unsaved history

    const newPlan = await db.mealPlan.create({
      data: {
        userId: session.user.id,
        budget,
        ingredients,
        generatedPlan: correctedPlan.mealPlan,
        shoppingList: correctedPlan.shoppingList,
        isSaved: false,
      },
    });

    revalidatePath('/dashboard');
    return { success: true, data: correctedPlan, id: newPlan.id };
  } catch (error: any) {
    console.error('Meal Plan Generation Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate meal plan. Please try again.';
    // Provide a more friendly message for user
    const friendlyMessage = errorMessage.includes('Request Timeout') 
      ? 'The AI took too long to respond. Please try again.'
      : errorMessage.includes('schema') || errorMessage.includes('malformed')
      ? 'The AI returned an invalid response. Please try again.'
      : 'Failed to generate meal plan. Please try again.';
      
    return { success: false, error: friendlyMessage };
  }
}

export async function saveMealPlan(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const plan = await db.mealPlan.findUnique({ where: { id } });
    if (!plan || plan.userId !== session.user.id) {
      return { success: false, error: 'Not found or unauthorized' };
    }

    await db.mealPlan.update({
      where: { id },
      data: { isSaved: true },
    });

    revalidatePath('/dashboard');
    return { success: true, id };
  } catch (error) {
    console.error('Save Meal Plan Error:', error);
    return { success: false, error: 'Failed to save meal plan.' };
  }
}

export async function getMealHistory() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  try {
    const history = await db.mealPlan.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });
    return history;
  } catch (error) {
    console.error('Fetch Meal History Error:', error);
    return [];
  }
}

export async function deleteMealPlan(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const plan = await db.mealPlan.findUnique({ where: { id } });
    if (!plan || plan.userId !== session.user.id) {
      return { success: false, error: 'Not found or unauthorized' };
    }

    await db.mealPlan.delete({ where: { id } });
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Delete Meal Plan Error:', error);
    return { success: false, error: 'Failed to delete meal plan.' };
  }
}

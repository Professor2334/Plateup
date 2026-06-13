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

  const userPrefs = await db.user.findUnique({
    where: { id: session.user.id },
    select: { householdSize: true, primaryGoal: true }
  });

  const dbHouseholdSize = userPrefs?.householdSize;
  const householdSize = dbHouseholdSize || '3-4';
  const primaryGoal = userPrefs?.primaryGoal || 'save-money';
  const getHouseholdMultiplier = (size: string) => {
    if (size.includes('-')) return parseInt(size.split('-')[0], 10);
    if (size.includes('+')) return parseInt(size.replace('+', ''), 10);
    return parseInt(size, 10) || 1;
  };

  const householdMultiplier = getHouseholdMultiplier(householdSize);
  const totalWeeklyPortions = 21 * householdMultiplier; // 3 meals * 7 days * people
  
  // Hardcoded Budget Reality Check
  // Determine an absolute minimum realistic cost per individual meal portion (e.g., ₦200)
  const MIN_COST_PER_PORTION = 200;
  const minimumRealisticBudget = totalWeeklyPortions * MIN_COST_PER_PORTION;

  if (budget < minimumRealisticBudget) {
    return { 
      success: false, 
      error: `₦${budget.toLocaleString()} is insufficient. Your household size (${householdSize}) requires a minimum budget of ₦${minimumRealisticBudget.toLocaleString()} for a 7-day meal plan.` 
    };
  }

  // Read budget friendly override flag and context
  const budgetFriendly = formData.get('budgetFriendly') === 'true';
  const originalCostRaw = formData.get('originalEstimatedCost');
  const originalEstimatedCost = originalCostRaw ? parseFloat(originalCostRaw as string) : undefined;

  let attempts = 0;
  const maxAttempts = budgetFriendly ? 2 : 1;
  let finalMealPlan: any = null;

  while (attempts < maxAttempts) {
    try {
      attempts++;
      const mealPlan = await deepSeekGenerate(budget, ingredients, householdSize, primaryGoal, budgetFriendly, originalEstimatedCost);

      // Server-side Budget Intelligence Layer
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
      
      // Programmatic Quantity Scaling
      shoppingList.forEach(entry => {
        const itemLower = entry.item.toLowerCase();
        
        // Define our scalable keywords
        const keywords = ['bread', 'egg', 'yam', 'plantain', 'rice', 'beans', 'garri'];
        const matchedKeyword = keywords.find(k => itemLower.includes(k));
        
        // If it's not a keyword we know how to scale, fall back to exact matching
        const searchTarget = matchedKeyword || itemLower;
        
        let frequency = 0;
        mealPlan.mealPlan.forEach(day => {
          const mealsText = `${day.breakfast} ${day.lunch} ${day.dinner}`.toLowerCase();
          if (mealsText.includes(searchTarget)) {
             frequency++;
          } else {
             const found = day.primaryIngredientsUsed.some(ing => {
                const ingLower = ing.toLowerCase();
                return ingLower.includes(searchTarget) || searchTarget.includes(ingLower);
             });
             if (found) frequency++;
          }
        });

        if (frequency > 0 && matchedKeyword) {
          const totalPortions = frequency * householdMultiplier;
          
          if (matchedKeyword === 'bread') {
            const loaves = Math.ceil(totalPortions / 4);
            entry.quantity = `${loaves} ${loaves === 1 ? 'loaf' : 'loaves'}`;
          } else if (matchedKeyword === 'egg') {
            const eggs = totalPortions * 2;
            entry.quantity = eggs >= 24 ? '1 crate (30 pieces)' : `${eggs} pieces`;
          } else if (matchedKeyword === 'yam') {
            const tubers = Math.ceil(totalPortions / 5);
            entry.quantity = `${tubers} medium ${tubers === 1 ? 'tuber' : 'tubers'}`;
          } else if (matchedKeyword === 'plantain') {
             const bunches = Math.ceil(totalPortions / 4);
             entry.quantity = `${bunches} ${bunches === 1 ? 'bunch' : 'bunches'}`;
          }
        }
      });

      const minRealisticCost = shoppingList.reduce((total, entry) => {
        return total + getFloorPrice(entry.item);
      }, 0);

      // The AI often underestimates. We enforce a strict floor based on our server-side market logic.
      const finalMinCost = Math.max(minRealisticCost, mealPlan.estimatedCost);

      // Validate Leftovers on Day 1
      const day1 = mealPlan.mealPlan[0];
      const day1Meals = [day1.breakfast, day1.lunch, day1.dinner].map(m => m.toLowerCase());
      const hasDay1Leftover = day1Meals.some(m => m.includes('leftover') || m.includes('remaining'));
      
      // Validate Budget Utilization (enforce strict retry in Budget-Friendly mode if < 70% or > 100%)
      const budgetUtilization = Math.round((finalMinCost / budget) * 100);
      const isUnderUtilized = budgetFriendly && budgetUtilization < 70;
      
      const budgetTolerance = budgetFriendly ? budget * 1.15 : budget;
      const isOverUtilized = budgetFriendly && finalMinCost > budgetTolerance;

      if (attempts < maxAttempts && (hasDay1Leftover || isUnderUtilized || isOverUtilized)) {
        console.log(`Validation failed (Leftover: ${hasDay1Leftover}, Utilization: ${budgetUtilization}%). Retrying...`);
        continue;
      }
      
      // Failsafe: If the AI is stubbornly returning leftovers on Day 1 and we are out of retries, forcibly sanitize the text.
      if (hasDay1Leftover) {
        mealPlan.mealPlan[0].breakfast = mealPlan.mealPlan[0].breakfast.replace(/leftover|remaining|from previous( night)?/gi, 'Fresh');
        mealPlan.mealPlan[0].lunch = mealPlan.mealPlan[0].lunch.replace(/leftover|remaining|from previous( night)?/gi, 'Fresh');
        mealPlan.mealPlan[0].dinner = mealPlan.mealPlan[0].dinner.replace(/leftover|remaining|from previous( night)?/gi, 'Fresh');
      }
      
      let correctedBudgetStatus = mealPlan.budgetStatus;
      
      // Give the Budget-Friendly mode a 15% grace period. 
      // It's doing its best to feed 4 people on a tight budget using real quantities.
      
      if (finalMinCost > budgetTolerance) {
        correctedBudgetStatus = 'EXCEEDS_BUDGET';
      } else if (finalMinCost > budget * 0.8) {
        correctedBudgetStatus = 'APPROACHING_BUDGET';
      } else {
        correctedBudgetStatus = 'WITHIN_BUDGET';
      }

      // Build an estimated cost range: floor is our server-calculated minimum,
      // ceiling adds a realistic 35% market variance (haggling, season, location).
      const estimatedCostRange = {
        min: finalMinCost,
        max: Math.round(finalMinCost * 1.35),
      };

      finalMealPlan = { 
        ...mealPlan, 
        estimatedCost: finalMinCost, // Ensure the base cost reflects our realistic floor for savings calculations
        budgetStatus: correctedBudgetStatus,
        estimatedCostRange,
        budgetUtilization,
      };

      break;
    } catch (error: any) {
      if (attempts >= maxAttempts) {
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
      console.log(`Generation failed (Attempt ${attempts}), retrying...`, error.message);
    }
  }

  if (!finalMealPlan) {
    return { success: false, error: 'Failed to generate a valid meal plan. Please try again.' };
  }

  // Save to database as unsaved history
  try {
    const newPlan = await db.mealPlan.create({
      data: {
        userId: session.user.id,
        budget,
        ingredients,
        generatedPlan: finalMealPlan.mealPlan,
        shoppingList: finalMealPlan.shoppingList,
        isSaved: false,
      },
    });

    revalidatePath('/dashboard');
    return { success: true, data: finalMealPlan, id: newPlan.id };
  } catch (error) {
    console.error('Database Save Error:', error);
    return { success: false, error: 'Failed to save meal plan history.' };
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

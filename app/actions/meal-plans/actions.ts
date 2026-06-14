'use server';

import { auth } from '@/lib/auth';
import db from '@/lib/db';
import { generateMealPlan as deepSeekGenerate } from '@/lib/deepseek';
import { MealPlanGenerationSchema } from '@/lib/validators';
import { revalidatePath } from 'next/cache';

import { generationRateLimit } from '@/lib/rate-limit';
import { validateAndSanitizeLeftovers } from '@/lib/leftover-validator';
import { enforceMealVariety } from '@/lib/variety-validator';
import { pruneShoppingList } from '@/lib/shopping-validator';
import { ValidationReporter } from '@/lib/validation-reporter';
import { validateAndSanitizeOutput } from '@/lib/sanitization-validator';

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
  const maxAttempts = 3;
  let finalMealPlan: any = null;

  while (attempts < maxAttempts) {
    const reporter = new ValidationReporter();
    try {
      attempts++;
      const mealPlan = await deepSeekGenerate(budget, ingredients, householdSize, primaryGoal, budgetFriendly, originalEstimatedCost);

      // --- LIGHTWEIGHT BACKEND VALIDATION LAYER ---
      let finalShoppingList = mealPlan.shoppingList || [];

      // 1. Remove pantry items
      pruneShoppingList(ingredients, finalShoppingList);
      reporter.logPass('Pantry Pruning Validation');

      // 2. Remove leftovers and trivial non-purchasables
      finalShoppingList = finalShoppingList.filter((entry: any) => {
        const lower = entry.item.toLowerCase();
        if (/(leftover|remaining|extra|previous meal)/.test(lower)) return false;
        if (['water', 'salt', 'maggi', 'seasoning cube', 'curry', 'thyme', 'garlic', 'ginger', 'knorr', 'bouillon'].some(i => lower.includes(i))) return false;
        return true;
      });
      reporter.logPass('Leftover & Trivial Item Validation');

      // 3. Remove duplicate items (Fuzzy Matching)
      const deduplicated = new Map<string, string>();
      
      const normalizeItem = (item: string) => {
        return item.toLowerCase()
          .replace(/\b(fresh|raw|dry|dried|tin|canned|frozen|bunch|pieces|medium|large|small)\b/g, '')
          .replace(/ies\b/, 'y')
          .replace(/s\b/, '')
          .trim();
      };

      for (const entry of finalShoppingList) {
          const originalLower = entry.item.toLowerCase().trim();
          if (originalLower.length === 0) continue;
          
          const normalized = normalizeItem(originalLower);
          
          // Substring matching to catch "Tomato" vs "Fresh Tomatoes"
          let matchedKey = null;
          for (const key of Array.from(deduplicated.keys())) {
            if (key.includes(normalized) || normalized.includes(key)) {
              matchedKey = key;
              // Keep the shorter/broader key as the root
              if (normalized.length < key.length && normalized.length > 2) {
                matchedKey = normalized;
                const oldVal = deduplicated.get(key)!;
                deduplicated.delete(key);
                deduplicated.set(matchedKey, oldVal);
              }
              break;
            }
          }

          if (matchedKey) {
            deduplicated.set(matchedKey, `${deduplicated.get(matchedKey)} + ${entry.quantity}`);
          } else {
            deduplicated.set(normalized, entry.quantity);
          }
      }
      
      finalShoppingList = Array.from(deduplicated.entries()).map(([item, quantity]) => ({
          item: item.charAt(0).toUpperCase() + item.slice(1), 
          quantity
      }));
      reporter.logPass('Fuzzy Shopping List Deduplication');

      mealPlan.shoppingList = finalShoppingList;

      // 0. Output Sanitization Validation
      try {
        validateAndSanitizeOutput(mealPlan.mealPlan);
        reporter.logPass('Output Sanitization Validation');
      } catch (err: any) {
        const actionMessage = attempts < maxAttempts ? 'Regenerate meal plan.' : 'Max attempts reached. Plan rejected.';
        reporter.logFail('Output Sanitization Validation', err.message, actionMessage);
        reporter.printFinal('REJECTED');
        if (attempts < maxAttempts) {
          continue;
        } else {
          throw new Error('Failed to generate a clean meal plan without AI reasoning after multiple attempts.');
        }
      }

      // 1. Strict Leftover Validation & Sanitization
      validateAndSanitizeLeftovers(mealPlan.mealPlan);
      reporter.logPass('Leftover Validation');

      // 2. Strict Meal Variety Enforcement
      enforceMealVariety(mealPlan.mealPlan, ingredients);
      reporter.logPass('Meal Variety Validation');

      // The AI's native 'ingredientUtilization' text now replaces the obsolete numeric score logging.
      reporter.logPass('AI Ingredient Utilization', mealPlan.ingredientUtilization);

      // Server-side Budget Intelligence Layer (Safety Net)
      const PRICE_FLOORS: Record<string, number> = {
        rice: 1200, beans: 1000, garri: 500, yam: 2000, plantain: 700,
        bread: 1000, semolina: 1200, potato: 1000,
        chicken: 2500, beef: 2500, eggs: 1000, fish: 1500, stockfish: 1500,
        mackerel: 1200, sardines: 800,
        tomatoes: 1000, onions: 500, pepper: 500, habanero: 500,
        vegetables: 400, okra: 400, coconut: 400,
        egusi: 1000, ogbono: 1000, crayfish: 800,
        'palm oil': 1000, 'groundnut oil': 1000, seasoning: 300,
      };

      const getFloorPrice = (item: string): number => {
        const lower = item.toLowerCase();
        if (['water', 'salt', 'maggi', 'seasoning cube', 'curry', 'thyme', 'garlic', 'ginger', 'knorr', 'bouillon'].some(i => lower.includes(i))) return 0;
        
        for (const [key, price] of Object.entries(PRICE_FLOORS)) {
          if (lower.includes(key)) return price;
        }
        return 300; // default floor for unrecognized small items
      };

      // Ensure the estimated cost is realistic and not drastically underestimated by AI
      const minRealisticCost = mealPlan.shoppingList.reduce((total: number, entry: any) => total + getFloorPrice(entry.item), 0);
      const safeEstimatedCost = Math.max(minRealisticCost, mealPlan.estimatedCost);

      // Validate Budget Utilization (enforce strict retry in Budget-Friendly mode if < 70% or > 100%)
      const budgetUtilization = Math.round((safeEstimatedCost / budget) * 100);
      const isUnderUtilized = budgetFriendly && budgetUtilization < 70;
      
      const budgetTolerance = budget; // Strict adherence to the budget limit
      const isOverUtilized = budgetFriendly && safeEstimatedCost > budgetTolerance;

      // BUDGET FRIENDLY OPTIMIZATION VALIDATION
      const isMoreExpensiveThanOriginal = budgetFriendly && originalEstimatedCost !== undefined && safeEstimatedCost >= originalEstimatedCost;

      if (isUnderUtilized || isOverUtilized || isMoreExpensiveThanOriginal) {
        let failReason = `Budget utilization was ${budgetUtilization}%`;
        if (isMoreExpensiveThanOriginal) failReason = `Alternative cost (₦${safeEstimatedCost}) was higher or equal to original cost (₦${originalEstimatedCost}).`;
        
        const actionMessage = attempts < maxAttempts ? 'Regenerate meal plan.' : 'Max attempts reached. Plan rejected.';
        reporter.logFail('Budget-Friendly Validation', failReason, actionMessage);
        reporter.printFinal('REJECTED');
        
        if (attempts < maxAttempts) {
          continue;
        } else {
          throw new Error('Failed to generate a valid budget-friendly plan after multiple attempts. Please adjust your pantry or budget and try again.');
        }
      }
      
      if (budgetFriendly) {
        reporter.logPass('Budget-Friendly Validation');
      }

      reporter.printFinal('APPROVED');
      
      // Calculate variance for UI realism
      const estimatedCostRange = {
        min: safeEstimatedCost,
        max: Math.round(safeEstimatedCost * 1.35),
      };

      finalMealPlan = { 
        ...mealPlan, 
        estimatedCost: safeEstimatedCost,
        estimatedCostRange,
        budgetUtilization,
      };

      break;
    } catch (error: any) {
      if (attempts >= maxAttempts) {
        console.error('Meal Plan Generation Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate meal plan. Please try again.';
        // Provide a more friendly message for user but preserve specific validation messages
        let friendlyMessage = 'Failed to generate meal plan. Please try again.';
        if (errorMessage.includes('Request Timeout')) friendlyMessage = 'The AI took too long to respond. Please try again.';
        else if (errorMessage.includes('schema') || errorMessage.includes('malformed')) friendlyMessage = 'The AI returned an invalid response. Please try again.';
        else friendlyMessage = errorMessage; // Return the exact validator error
          
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

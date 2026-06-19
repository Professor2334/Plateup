'use server';

import { auth } from '@/lib/auth';
import db from '@/lib/db';
import { generateMealPlan as deepSeekGenerate } from '@/lib/deepseek';
import { MealPlanGenerationSchema } from '@/lib/validators';
import { revalidatePath } from 'next/cache';

import { generationRateLimit } from '@/lib/rate-limit';
import { validateAndSanitizeLeftovers } from '@/lib/leftover-validator';
import { enforceMealVariety } from '@/lib/variety-validator';
import { pruneShoppingList, pruneUnusedShoppingItems } from '@/lib/shopping-validator';
import { ValidationReporter } from '@/lib/validation-reporter';
import { validateAndSanitizeOutput } from '@/lib/sanitization-validator';
import { validateShoppingQuantities } from '@/lib/quantity-validator';
import { calculatePantryScore } from '@/lib/pantry-scorer';
import { BASE_PORTION_COST, REDUCTION_PER_ITEM, FLOOR_PORTION_COST } from '@/lib/constants';
import { fuzzyDeduplicateShoppingList, calculateSafeEstimatedCost, filterTrivialShoppingItems } from '@/lib/meal-pipeline';

export async function generateMealPlan(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  // Rate Limiting Check
  const { success: limitSuccess } = await generationRateLimit.limit(session.user.id);
  if (!limitSuccess) {
    return { success: false, error: 'RATE_LIMIT_EXCEEDED' };
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
  
  // Dynamic Budget Reality Check based on available pantry items
  const pantryItemsList = ingredients
    .split(',')
    .map(i => i.trim())
    .filter(i => i.length > 0);

  const dynamicPortionCost = Math.max(FLOOR_PORTION_COST, BASE_PORTION_COST - (pantryItemsList.length * REDUCTION_PER_ITEM));
  const minimumRealisticBudget = totalWeeklyPortions * dynamicPortionCost;

  if (budget < minimumRealisticBudget) {
    return { 
      success: false, 
      error: `₦${budget.toLocaleString()} is insufficient. Your household size (${householdSize}) with your current pantry size requires a minimum budget of ₦${minimumRealisticBudget.toLocaleString()} for a 7-day meal plan.` 
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

      // 1.5 Remove orphaned items (hallucinated items not in the meal plan)
      pruneUnusedShoppingItems(finalShoppingList, mealPlan.mealPlan);
      reporter.logPass('Orphaned Items Validation');

      // 2. Remove leftovers and trivial non-purchasables
      finalShoppingList = filterTrivialShoppingItems(finalShoppingList);
      reporter.logPass('Leftover & Trivial Item Validation');

      // 3. Remove duplicate items (Fuzzy Matching)
      finalShoppingList = fuzzyDeduplicateShoppingList(finalShoppingList);
      reporter.logPass('Fuzzy Shopping List Deduplication');

      mealPlan.shoppingList = finalShoppingList;

      // Scale shopping list quantities (Quantity Validation)
      validateShoppingQuantities(mealPlan.shoppingList, mealPlan.mealPlan, householdMultiplier);
      reporter.logPass('Quantity Validation');

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
          return { success: false, error: 'GENERATION_FAILED' };
        }
      }

      // 1. Strict Leftover Validation & Sanitization
      validateAndSanitizeLeftovers(mealPlan.mealPlan);
      reporter.logPass('Leftover Validation');

      // 2. Meal Variety Enforcement (Soft/Informational check & Mutation fallback)
      enforceMealVariety(mealPlan.mealPlan, ingredients);
      
      const uniqueMeals = new Set<string>();
      mealPlan.mealPlan.forEach((day: any) => {
        uniqueMeals.add(day.breakfast.toLowerCase().trim());
        uniqueMeals.add(day.lunch.toLowerCase().trim());
        uniqueMeals.add(day.dinner.toLowerCase().trim());
      });
      const varietyScore = Math.round((uniqueMeals.size / 21) * 100);
      reporter.logPass('Meal Variety Score', `Meal Variety Score: ${varietyScore}% (${uniqueMeals.size} unique meals out of 21 slots)`);

      // 3. Pantry Utilization Validation (Soft/Informational)
      const pantryResult = calculatePantryScore(ingredients, mealPlan.mealPlan, mealPlan.shoppingList);
      
      reporter.logPass('AI Ingredient Utilization', mealPlan.ingredientUtilization);
      
      const pantryLogDetails = `Pantry Utilization:\n${pantryResult.score}%\n\nPantry Items Used:\n${pantryResult.usedItemsCount}/${pantryResult.availableItemsCount}\n\nNew Items Required:\n${pantryResult.newItemsCount}\n\nStatus:\n${pantryResult.status}`;
      reporter.logPass('Pantry Utilization Validation', pantryLogDetails);

      // Ensure the estimated cost is realistic and not drastically underestimated by AI
      const safeEstimatedCost = calculateSafeEstimatedCost(mealPlan.shoppingList, mealPlan.estimatedCost);

      const budgetUtilization = Math.round((safeEstimatedCost / budget) * 100);

      // Classify Feasibility
      let budgetStatus: 'WITHIN_BUDGET' | 'APPROACHING_BUDGET' | 'EXCEEDS_BUDGET';
      if (safeEstimatedCost <= budget * 0.75) {
        budgetStatus = 'WITHIN_BUDGET'; // Comfortable
      } else if (safeEstimatedCost <= budget) {
        budgetStatus = 'APPROACHING_BUDGET'; // Tight
      } else {
        budgetStatus = 'EXCEEDS_BUDGET'; // Likely Insufficient
      }

      // Budget/Cost Optimization Scores (Soft/Informational)
      const budgetEfficiencyScore = Math.max(0, 100 - budgetUtilization);
      reporter.logPass('Budget Efficiency Score', `Budget Efficiency Score: ${budgetEfficiencyScore}% (estimated spending utilizes ${budgetUtilization}% of budget)`);

      const costOptimizationScore = pantryResult.score;
      reporter.logPass('Cost Optimization Score', `Cost Optimization Score: ${costOptimizationScore}% (driven by pantry utilization and budget alignment)`);

      reporter.logPass('Feasibility Validation', `Status: ${budgetStatus}, Estimated Spending: ₦${safeEstimatedCost}`);

      // In budget-friendly mode, the plan must fit within budget (Comfortable or Tight).
      const isUnderUtilized = budgetFriendly && budgetUtilization < 70;
      const isOverUtilized = budgetFriendly && budgetStatus === 'EXCEEDS_BUDGET';
      const isMoreExpensiveThanOriginal = budgetFriendly && originalEstimatedCost !== undefined && safeEstimatedCost >= originalEstimatedCost;

      if (isUnderUtilized || isOverUtilized || isMoreExpensiveThanOriginal) {
        let failReason = `Budget utilization was ${budgetUtilization}%`;
        if (isMoreExpensiveThanOriginal) failReason = `Alternative cost (₦${safeEstimatedCost}) was higher or equal to original cost (₦${originalEstimatedCost}).`;
        else if (isOverUtilized) failReason = `Alternative cost (₦${safeEstimatedCost}) exceeded the budget limit (₦${budget}).`;
        
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
        budgetStatus,
      };

      break;
    } catch (error: any) {
      if (attempts >= maxAttempts) {
        return { success: false, error: 'GENERATION_FAILED' };
      }
      console.log(`Generation failed (Attempt ${attempts}), retrying...`, error.message);
    }
  }

  if (!finalMealPlan) {
    return { success: false, error: 'GENERATION_FAILED' };
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
      // Limit to 100 plans — prevents unbounded DB reads for heavy users
      take: 100,
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

export async function deleteAllMealPlans() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await db.mealPlan.deleteMany({ where: { userId: session.user.id } });
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Delete All Meal Plans Error:', error);
    return { success: false, error: 'Failed to clear meal history.' };
  }
}


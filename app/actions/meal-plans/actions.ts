'use server';

import { auth } from '@/lib/auth';
import db from '@/lib/db';
import { generateMealPlan as deepSeekGenerate, type MealPlanResponse } from '@/lib/deepseek';
import { MealPlanGenerationSchema } from '@/lib/validators';
import { revalidatePath } from 'next/cache';

import { generationRateLimit } from '@/lib/rate-limit';
import { validateAndSanitizeLeftovers } from '@/lib/leftover-validator';
import { enforceMealVariety } from '@/lib/variety-validator';
import { pruneShoppingList, pruneUnusedShoppingItems } from '@/lib/shopping-validator';
import { ValidationReporter } from '@/lib/validation-reporter';
import { handleActionError } from '@/lib/error-handler';
import { validateAndSanitizeOutput } from '@/lib/sanitization-validator';
import { validateCulturalCorrectness } from '@/lib/cultural-validator';
import { validateShoppingQuantities } from '@/lib/quantity-validator';
import { calculatePantryScore } from '@/lib/pantry-scorer';
import { BASE_PORTION_COST, REDUCTION_PER_ITEM, FLOOR_PORTION_COST } from '@/lib/constants';
import { fuzzyDeduplicateShoppingList, calculateSafeEstimatedCost, filterTrivialShoppingItems } from '@/lib/meal-pipeline';
import { validateIngredients } from '@/lib/ai-sanitizer';

export async function generateMealPlan(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  // Rate Limiting Check
  const { success: limitSuccess } = await generationRateLimit.limit(session.user.id);
  if (!limitSuccess) {
    console.warn(`[Rate Limit] User ${session.user.id} exceeded rate limit.`);
    return { success: false, error: "You've reached your daily meal plan limit (10/10). Please try again tomorrow." };
  }

  const budget = parseFloat(formData.get('budget') as string);
  const ingredients = formData.get('ingredients') as string;

  const validatedFields = MealPlanGenerationSchema.safeParse({ budget, ingredients });

  if (!validatedFields.success) {
    return { success: false, error: 'The details you provided seem incorrect. Please check your inputs and try again.' };
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
  let finalMealPlan: MealPlanResponse | null = null;

  while (attempts < maxAttempts) {
    const reporter = new ValidationReporter();
    try {
      attempts++;
      const mealPlan = await deepSeekGenerate(budget, ingredients, householdSize, primaryGoal, budgetFriendly, originalEstimatedCost);

      // --- LIGHTWEIGHT BACKEND VALIDATION LAYER ---

      // 1. Output Sanitization Validation
      try {
        validateAndSanitizeOutput(mealPlan.mealPlan);
        reporter.logPass('Output Sanitization Validation');
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        const actionMessage = attempts < maxAttempts ? 'Regenerate meal plan.' : 'Max attempts reached. Plan rejected.';
        reporter.logFail('Output Sanitization Validation', errorMessage, actionMessage);
        reporter.printFinal('REJECTED');
        if (attempts < maxAttempts) {
          continue;
        } else {
          throw err;
        }
      }

      // 2. Cultural Correctness Validation (silent corrections)
      try {
        validateCulturalCorrectness(mealPlan.mealPlan, ingredients);
        reporter.logPass('Cultural Correctness Validation');
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        const actionMessage = attempts < maxAttempts ? 'Regenerate meal plan.' : 'Max attempts reached. Plan rejected.';
        reporter.logFail('Cultural Correctness Validation', errorMessage, actionMessage);
        reporter.printFinal('REJECTED');
        if (attempts < maxAttempts) {
          continue;
        } else {
          throw err;
        }
      }

      // 3. Strict Leftover Validation & Sanitization
      validateAndSanitizeLeftovers(mealPlan.mealPlan);
      reporter.logPass('Leftover Validation');

      // 4. Meal Variety Enforcement (Soft/Informational check & Mutation fallback)
      enforceMealVariety(mealPlan.mealPlan, ingredients);
      
      const uniqueMeals = new Set<string>();
      mealPlan.mealPlan.forEach((day: { breakfast: string, lunch: string, dinner: string }) => {
        uniqueMeals.add(day.breakfast.toLowerCase().trim());
        uniqueMeals.add(day.lunch.toLowerCase().trim());
        uniqueMeals.add(day.dinner.toLowerCase().trim());
      });
      const varietyScore = Math.round((uniqueMeals.size / 21) * 100);
      reporter.logPass('Meal Variety Score', `Meal Variety Score: ${varietyScore}% (${uniqueMeals.size} unique meals out of 21 slots)`);

      // 5. Shopping List Generation & Sanitization
      let finalShoppingList = mealPlan.shoppingList || [];

      // E1: Consistency Check (Auto-corrects missing ingredients on corrected meal plan)
      validateIngredients(ingredients, finalShoppingList, mealPlan.mealPlan);
      reporter.logPass('AI Ingredient Consistency Check');

      // E2: Remove pantry items
      pruneShoppingList(ingredients, finalShoppingList);
      reporter.logPass('Pantry Pruning Validation');

      // E3: Remove orphaned items
      pruneUnusedShoppingItems(finalShoppingList, mealPlan.mealPlan);
      reporter.logPass('Orphaned Items Validation');

      // E4: Remove leftovers and trivial non-purchasables
      finalShoppingList = filterTrivialShoppingItems(finalShoppingList);
      reporter.logPass('Leftover & Trivial Item Validation');

      // E5: Remove duplicate items (Fuzzy Matching)
      finalShoppingList = fuzzyDeduplicateShoppingList(finalShoppingList);
      reporter.logPass('Fuzzy Shopping List Deduplication');

      mealPlan.shoppingList = finalShoppingList;

      // E6: Scale shopping list quantities (Quantity Validation)
      validateShoppingQuantities(mealPlan.shoppingList, mealPlan.mealPlan, householdMultiplier);
      reporter.logPass('Quantity Validation');

      // E7: Strict Shopping List Validation
      const hasUnmeasurableQuantities = mealPlan.shoppingList.some(item => 
        item.quantity.toLowerCase().includes('as needed')
      );
      if (hasUnmeasurableQuantities) {
        reporter.logFail('Shopping List Validation', 'Shopping list contains "As needed" quantities.', 'Rejecting plan.');
        reporter.printFinal('REJECTED');
        if (attempts < maxAttempts) {
          continue;
        } else {
          throw new Error('Failed to generate a meal plan with measurable shopping list quantities.');
        }
      }
      reporter.logPass('Strict Shopping List Validation');

      // 6. Pantry Utilization Validation (Soft/Informational)
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

      // In both modes, we fail if the budget constraints are impossible (recalculated cost exceeds budget).
      // In budget-friendly mode, we also try to optimize if the plan is under-utilized or more expensive than the original.
      const isUnderUtilized = budgetFriendly && budgetUtilization < 70;
      const isOverUtilized = budgetStatus === 'EXCEEDS_BUDGET';
      const isMoreExpensiveThanOriginal = budgetFriendly && originalEstimatedCost !== undefined && safeEstimatedCost >= originalEstimatedCost;

      if (isUnderUtilized || isOverUtilized || isMoreExpensiveThanOriginal) {
        let failReason = `Budget utilization was ${budgetUtilization}%`;
        if (isMoreExpensiveThanOriginal) {
          failReason = `Alternative cost (₦${safeEstimatedCost.toLocaleString()}) was higher or equal to original cost (₦${originalEstimatedCost.toLocaleString()}).`;
        } else if (isOverUtilized) {
          failReason = `Cost (₦${safeEstimatedCost.toLocaleString()}) exceeded the budget limit (₦${budget.toLocaleString()}).`;
        }
        
        const actionMessage = attempts < maxAttempts ? 'Regenerate meal plan.' : 'Max attempts reached. Plan rejected.';
        reporter.logFail('Budget Validation', failReason, actionMessage);
        reporter.printFinal('REJECTED');
        
        if (attempts < maxAttempts) {
          continue;
        } else {
          // Only fail (throw error) if the budget constraints are impossible (exceeds budget limit).
          // Otherwise (for under-utilization or not cheaper than original), do not fail the generation, just accept the best we found!
          if (isOverUtilized) {
            throw new Error(`Failed to generate a meal plan within your budget limit of ₦${budget.toLocaleString()} after multiple attempts. Please adjust your pantry or budget and try again.`);
          }
          break;
        }
      }
      
      reporter.logPass('Budget Validation');

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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (attempts >= maxAttempts) {
        return { success: false, error: handleActionError(error, `Generation failed after ${maxAttempts} attempts. Last error: ${errorMessage}`) };
      }
      console.log(`Generation failed (Attempt ${attempts}), retrying...`, errorMessage);
    }
  }

  if (!finalMealPlan) {
    return { success: false, error: "We're having trouble generating your meal plan right now. Please try again in a moment." };
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

    // Update the user's last plan generated timestamp asynchronously
    db.user.update({
      where: { id: session.user.id },
      data: { lastPlanGeneratedAt: new Date() }
    }).catch(err => console.error('Failed to update lastPlanGeneratedAt:', err));

    revalidatePath('/dashboard');
    return { success: true, data: finalMealPlan, id: newPlan.id };
  } catch (error) {
    return { success: false, error: handleActionError(error, 'Failed to save meal plan history.') };
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
    return { success: false, error: handleActionError(error, 'Failed to save meal plan.') };
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
    return { success: false, error: handleActionError(error, 'Failed to delete meal plan.') };
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
    return { success: false, error: handleActionError(error, 'Failed to clear meal history.') };
  }
}


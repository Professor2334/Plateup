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

import { fuzzyDeduplicateShoppingList, calculateSafeEstimatedCost, filterTrivialShoppingItems } from '@/lib/meal-pipeline';
import { validateIngredients } from '@/lib/ai-sanitizer';
import { validateMealPlanInputs } from '@/lib/input-validator';

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
    select: { householdSize: true, primaryGoal: true, mealFrequency: true }
  });

  const dbHouseholdSize = userPrefs?.householdSize;
  const householdSize = dbHouseholdSize || '3-4';
  // primaryGoal is stored as a String[] in the DB; fall back to ['save-money'] for users who have no goals yet
  const primaryGoals: string[] = (userPrefs?.primaryGoal && userPrefs.primaryGoal.length > 0)
    ? userPrefs.primaryGoal
    : ['save-money'];
  const mealFrequency = userPrefs?.mealFrequency || '3_meals';
  const getHouseholdMultiplier = (size: string) => {
    if (size.includes('-')) return parseInt(size.split('-')[0], 10);
    if (size.includes('+')) return parseInt(size.replace('+', ''), 10);
    return parseInt(size, 10) || 1;
  };

  const householdMultiplier = getHouseholdMultiplier(householdSize);
  const pantryItemsList = ingredients
    .split(',')
    .map(i => i.trim())
    .filter(i => i.length > 0);

  const validation = validateMealPlanInputs(budget, householdSize, pantryItemsList.length);
  if (validation.status === 'UNREALISTIC') {
    return {
      success: false,
      error: validation.message
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
      const mealPlan = await deepSeekGenerate(budget, ingredients, householdSize, primaryGoals, budgetFriendly, originalEstimatedCost, mealFrequency);

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
      const isTwoMealMode = mealFrequency === '2_meals';
      mealPlan.mealPlan.forEach((day: { breakfast: string, lunch: string, dinner: string }) => {
        uniqueMeals.add(day.breakfast.toLowerCase().trim());
        if (!isTwoMealMode && day.lunch) uniqueMeals.add(day.lunch.toLowerCase().trim());
        uniqueMeals.add(day.dinner.toLowerCase().trim());
      });
      const totalMealSlots = isTwoMealMode ? 14 : 21;
      const varietyScore = Math.round((uniqueMeals.size / totalMealSlots) * 100);
      reporter.logPass('Meal Variety Score', `Meal Variety Score: ${varietyScore}% (${uniqueMeals.size} unique meals out of ${totalMealSlots} slots)`);

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
      
      // Calculate Pantry Contribution Level
      let pantryContribution: 'High' | 'Medium' | 'Low' = 'Low';
      if (pantryResult.score >= 65) {
        pantryContribution = 'High';
      } else if (pantryResult.score >= 35) {
        pantryContribution = 'Medium';
      }
      
      const pantryLogDetails = `Pantry Utilization:\n${pantryResult.score}%\nPantry Contribution: ${pantryContribution}\n\nPantry Items Used:\n${pantryResult.usedItemsCount}/${pantryResult.availableItemsCount}\n\nNew Items Required:\n${pantryResult.newItemsCount}\n\nStatus:\n${pantryResult.status}`;
      reporter.logPass('Pantry Utilization Validation', pantryLogDetails);

      // Ensure the estimated cost is realistic and not drastically underestimated by AI
      const safeEstimatedCost = calculateSafeEstimatedCost(mealPlan.shoppingList, mealPlan.estimatedCost);

      const budgetUtilization = Math.round((safeEstimatedCost / budget) * 100);
      const remainingBudget = Math.max(0, budget - safeEstimatedCost);

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
      // Pantry-Aware Budget Utilization Intelligence
      let targetMinUtilization = 60;
      if (budget < 25000) {
        targetMinUtilization = 80;
      } else if (budget <= 40000) {
        targetMinUtilization = 70;
      }

      // If they have a high pantry contribution, we allow even lower utilization (don't force them to spend)
      if (pantryContribution === 'High') {
        targetMinUtilization -= 20; // e.g. 60% becomes 40%, 80% becomes 60%
      } else if (pantryContribution === 'Medium') {
        targetMinUtilization -= 10;
      }
      
      // Goal Priority Overrides for Budget Intelligence
      const goalsLower = primaryGoals.map(g => g.toLowerCase());
      const hasGoal = (slug: string) => goalsLower.some(g => g.includes(slug));

      if (hasGoal('save-money')) {
        // Under-utilizing is a SUCCESS for save-money. Do not fail on under-utilization.
        targetMinUtilization = 0;
      } else if (hasGoal('eat-healthy') || hasGoal('feed-a-large-family')) {
        // These goals require substantial food volume/quality. We raise the minimum expectation.
        targetMinUtilization = Math.min(100, targetMinUtilization + 10);
      }
      
      // Ensure it doesn't go below 30% to prevent completely empty shopping lists on large budgets unless pantry is truly exhaustive
      // Exception: save-money goal allows 0% floor
      if (!hasGoal('save-money')) {
        targetMinUtilization = Math.max(30, targetMinUtilization);
      }

      // In budget-friendly mode, we optimize if the plan is under-utilized or more expensive than the original.
      // In standard mode, we also want to prevent severe under-utilization to ensure plan quality.
      const isUnderUtilized = budgetUtilization < targetMinUtilization;
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
        pantryContribution,
        remainingBudget
      };

      break;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (attempts >= maxAttempts) {
        console.error(`Generation failed after ${maxAttempts} attempts. Last error: ${errorMessage}`);
        const finalError = validation.status === 'LIMITED' 
          ? "Please adjust your pantry or budget and try again."
          : "We couldn't generate your meal plan right now. Please try again in a moment.";
        return { success: false, error: finalError };
      }
      console.error(`Generation failed (Attempt ${attempts}), retrying...`, errorMessage);
    }
  }

  if (!finalMealPlan) {
    const finalError = validation.status === 'LIMITED' 
      ? "Please adjust your pantry or budget and try again."
      : "We couldn't generate your meal plan right now. Please try again in a moment.";
    return { success: false, error: finalError };
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


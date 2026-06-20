/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { generateMealPlan as deepSeekGenerate } from '../lib/deepseek';
import { validateAndSanitizeLeftovers } from '../lib/leftover-validator';
import { pruneShoppingList } from '../lib/shopping-validator';
import { validateShoppingQuantities } from '../lib/quantity-validator';
import { enforceMealVariety } from '../lib/variety-validator';
import { ValidationReporter } from '../lib/validation-reporter';
import { validateAndSanitizeOutput } from '../lib/sanitization-validator';
import { calculatePantryScore } from '../lib/pantry-scorer';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function runTest() {
  const configs = [
    { name: "Test D (Pantry Heavy)", household: "4", budget: 50000, ingredients: "Rice, Beans, Yam, Garri, Palm Oil, Vegetable Oil, Pepper, Onion, Salt, Maggi, Crayfish, Fish, Meat, Tomatoes", goal: "eat-healthy" },
    { name: "Test B (Likely Insufficient)", household: "4", budget: 10000, ingredients: "Salt", goal: "save-money" },
    { name: "Test C (Budget-Friendly Alternative)", household: "3", budget: 25000, ingredients: "Rice, Beans", goal: "save-money", budgetFriendly: true, originalEstimatedCost: 30000 },
    { name: "Test E (Quantity Validation)", household: "6", budget: 60000, ingredients: "Salt", goal: "eat-healthy" },
    { name: "Test F (Leftover Validation)", household: "1", budget: 15000, ingredients: "Rice, Garri", goal: "save-time" },
    { name: "Test A (Comfortable)", household: "2", budget: 30000, ingredients: "Rice, Oil, Salt, Onions", goal: "save-time" },
    { name: "Test H (High Budget)", household: "2", budget: 100000, ingredients: "Salt", goal: "eat-healthy" },
  ];

  for (const config of configs) {
    console.log(`\n======================================================`);
    console.log(`=== RUNNING: ${config.name}`);
    console.log(`=== Household: ${config.household} | Budget: ₦${config.budget} | Mode: ${config.budgetFriendly ? 'Budget-Friendly' : 'Standard'}`);
    console.log(`======================================================`);
    
    // Quick Reality Check 
    const householdMultiplier = parseInt(config.household, 10);
    const totalWeeklyPortions = 21 * householdMultiplier;
    const pantryItemsList = config.ingredients
      .split(',')
      .map(i => i.trim())
      .filter(i => i.length > 0);

    const basePortionCost = 450;
    const reductionPerItem = 25; // ₦25 reduction per pantry item
    const floorPortionCost = 200; // ₦200 floor portion cost
    const dynamicPortionCost = Math.max(floorPortionCost, basePortionCost - (pantryItemsList.length * reductionPerItem));
    const minRealisticBudget = totalWeeklyPortions * dynamicPortionCost;

    if (config.budget < minRealisticBudget) {
        console.log(`\n[EARLY REJECTION] ₦${config.budget} is insufficient. Minimum required is ₦${minRealisticBudget}.`);
        continue;
    }

    try {
      const result = await deepSeekGenerate(
        config.budget, 
        config.ingredients, 
        config.household, 
        config.goal, 
        config.budgetFriendly,
        config.originalEstimatedCost
      );
      
      const reporter = new ValidationReporter();

      console.log("\n[1] RAW AI GENERATION COMPLETED");
      console.log("Raw AI Estimated Cost:", result.estimatedCost);
      console.log("Raw Shopping List Count:", result.shoppingList.length);

      // Validate Output Cleanliness
      try {
        validateAndSanitizeOutput(result.mealPlan);
        reporter.logPass('Output Sanitization Validation');
      } catch (e: any) {
        reporter.logFail('Output Sanitization Validation', e.message, 'Plan would be rejected in production.');
        reporter.printFinal('REJECTED');
        continue;
      }

      // Validate Leftovers
      validateAndSanitizeLeftovers(result.mealPlan);
      reporter.logPass('Leftover Validation');
      
      // Validate Variety
      enforceMealVariety(result.mealPlan, config.ingredients);
      reporter.logPass('Meal Variety Validation');

      // Enrich Shopping List
      const shoppingList = result.shoppingList as Array<any>;
      pruneShoppingList(config.ingredients, shoppingList);
      reporter.logPass('Shopping List Validation');
      
      // Validate Quantities
      validateShoppingQuantities(shoppingList, result.mealPlan, householdMultiplier);
      reporter.logPass('Quantity Validation');

      // Pantry Utilization Validation (Soft/Informational)
      const pantryResult = calculatePantryScore(config.ingredients, result.mealPlan, shoppingList);

      reporter.logPass('AI Ingredient Utilization', result.ingredientUtilization);

      const finalMinCost = shoppingList.reduce((total, entry) => {
          if (!entry.estimatedCost) return total + 500;
          return total + entry.estimatedCost;
      }, 0);
      const finalCost = Math.max(finalMinCost, result.estimatedCost);

      const pantryLogDetails = `Pantry Utilization:\n${pantryResult.score}%\n\nPantry Items Used:\n${pantryResult.usedItemsCount}/${pantryResult.availableItemsCount}\n\nNew Items Required:\n${pantryResult.newItemsCount}\n\nStatus:\n${pantryResult.status}`;
      reporter.logPass('Pantry Utilization Validation', pantryLogDetails);

      const isMoreExpensiveThanOriginal = config.budgetFriendly && config.originalEstimatedCost && finalCost >= config.originalEstimatedCost;
      const isUnderUtilized = config.budgetFriendly && (finalCost / config.budget) < 0.7;

      if (isMoreExpensiveThanOriginal || isUnderUtilized) {
          reporter.logFail('Budget-Friendly Validation', 'Cost was higher than original or underutilized.', 'Regenerate meal plan.');
          reporter.printFinal('REJECTED');
      } else {
          reporter.logPass('Budget-Friendly Validation');
          reporter.printFinal('APPROVED');
          
          console.log(`\n=> FINAL COST: ₦${finalCost}`);
          console.log(`=> BUDGET UTILIZATION: ${Math.round((finalCost / config.budget) * 100)}%`);
          
          console.log("\n=> FINAL SHOPPING LIST:");
          shoppingList.forEach(item => {
             console.log(`   - ${item.item}: ${item.quantity} (Est. ₦${item.estimatedCost || '?'})`);
          });
          
          console.log("\n=> FINAL MEAL PLAN:");
          result.mealPlan.forEach((day: any) => {
             console.log(`   [${day.day}]`);
             console.log(`      B: ${day.breakfast}`);
             console.log(`      L: ${day.lunch}`);
             console.log(`      D: ${day.dinner}`);
             if (day.primaryIngredientsUsed && day.primaryIngredientsUsed.length > 0) {
                 console.log(`      > Ingredients Used: ${day.primaryIngredientsUsed.join(', ')}`);
             }
          });
      }
    } catch (e: any) {
      console.error(`Error in ${config.name}:`, e.message);
    }
  }
}

runTest();

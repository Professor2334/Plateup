/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { config } from 'dotenv';
config({ path: '.env' });
config({ path: '.env.local' });

import { generateMealPlan, MealPlanResponse } from './lib/deepseek';

async function runTests() {
  const budgets = [10000, 20000, 50000];
  const modes = [false, true]; // false = recommended, true = budgetFriendly
  
  for (const budget of budgets) {
    for (const budgetFriendly of modes) {
      console.log(`\n================================`);
      console.log(`TESTING: Budget = ${budget}, BudgetFriendly = ${budgetFriendly}`);
      console.log(`================================`);
      try {
        const result: MealPlanResponse = await generateMealPlan(
          budget,
          '', // no available ingredients
          '1', // household size
          ['save-money'],
          budgetFriendly,
          undefined
        );
        
        console.log(`\n--- ESTIMATED COST ---`);
        console.log(`Reported Estimated Cost: ${result.estimatedCost}`);
        console.log(`Budget Utilization: ${result.budgetUtilization}%`);
        
        console.log(`\n--- MEAL FREQUENCY ---`);
        const mealCounts: Record<string, number> = {};
        result.mealPlan.forEach(day => {
           [day.breakfast, day.lunch, day.dinner].forEach(meal => {
              const m = meal.replace(/leftover|remaining|from previous night/gi, '').trim();
              if (m.length > 5) {
                mealCounts[m] = (mealCounts[m] || 0) + 1;
              }
           });
        });
        Object.entries(mealCounts)
          .sort((a, b) => b[1] - a[1])
          .forEach(([m, count]) => {
            console.log(`[${count}x] ${m}`);
          });

        console.log(`\n--- SHOPPING LIST ---`);
        result.shoppingList.forEach(item => {
           console.log(`- ${item.item}: ${item.quantity}`);
        });

        // Test the validation logics from actions.ts
        const hasError = false;
        
        // 1. Missing ingredients validation
        const allRequired = new Set<string>();
        result.mealPlan.forEach(d => d.primaryIngredientsUsed.forEach(i => allRequired.add(i.toLowerCase())));
        const missing: string[] = [];
        Array.from(allRequired).forEach(req => {
            const isListed = result.shoppingList.some(item => item.item.toLowerCase().includes(req));
            if (!isListed) {
                missing.push(req);
            }
        });
        if (missing.length > 0) {
           console.log(`\n[WARNING] Missing ingredients from shopping list: ${missing.join(', ')}`);
        }

        // 2. Leftover validation
        const cooked = new Set<string>();
        let leftoverError = false;
        result.mealPlan.forEach((day, index) => {
           [day.breakfast, day.lunch, day.dinner].forEach(meal => {
             const lower = meal.toLowerCase();
             if (lower.includes('leftover') || lower.includes('remaining')) {
                 if (index === 0) leftoverError = true; // day 1 leftover
                 // Note: actual recursive leftover validation omitted for brevity, but we check day 1
             }
           });
        });
        if (leftoverError) {
            console.log(`\n[WARNING] Leftover detected on Day 1!`);
        }

      } catch (err: any) {
        console.error('Error during generation:', err.message || err);
      }
    }
  }
}

runTests();

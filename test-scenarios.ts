import { generateMealPlan as deepSeekGenerate } from './lib/deepseek';
import { pruneShoppingList } from './lib/shopping-validator';
import dotenv from 'dotenv';
dotenv.config();

async function runScenario(name: string, budget: number, ingredients: string, householdSize: string, budgetFriendly: boolean, originalCost?: number) {
  console.log(`\n======================================================`);
  console.log(`SCENARIO: ${name}`);
  console.log(`Budget: ${budget} | Household: ${householdSize} | BudgetFriendly: ${budgetFriendly}`);
  console.log(`Ingredients: ${ingredients}`);
  console.log(`======================================================`);
  
  try {
    const mealPlan = await deepSeekGenerate(budget, ingredients, householdSize, 'save-money', budgetFriendly, originalCost);
    
    // Simulate Lightweight Validation Layer
    let finalShoppingList = mealPlan.shoppingList || [];

    // 1. Remove pantry items
    pruneShoppingList(ingredients, finalShoppingList);
    
    // 2. Remove leftovers and trivial items
    finalShoppingList = finalShoppingList.filter((entry: any) => {
      const lower = entry.item.toLowerCase();
      if (/(leftover|remaining|extra|previous meal)/.test(lower)) return false;
      if (['water', 'salt', 'maggi', 'seasoning cube', 'curry', 'thyme', 'garlic', 'ginger', 'knorr', 'bouillon'].some(i => lower.includes(i))) return false;
      return true;
    });

    // 3. Remove duplicate items
    const deduplicated = new Map<string, string>();
    for (const entry of finalShoppingList) {
        const lower = entry.item.toLowerCase().trim();
        if (lower.length === 0) continue;
        if (!deduplicated.has(lower)) {
          deduplicated.set(lower, entry.quantity);
        } else {
          deduplicated.set(lower, `${deduplicated.get(lower)} + ${entry.quantity}`);
        }
    }
    finalShoppingList = Array.from(deduplicated.entries()).map(([item, quantity]) => ({
        item: item.charAt(0).toUpperCase() + item.slice(1), 
        quantity
    }));

    const budgetUtilization = Math.round((mealPlan.estimatedCost / budget) * 100);

    console.log(`\n--- RESULTS ---`);
    console.log(`Reported Estimated Cost: NGN ${mealPlan.estimatedCost}`);
    console.log(`Budget Utilization: ${budgetUtilization}%`);
    console.log(`Budget Status: ${mealPlan.budgetStatus}`);
    if (mealPlan.budgetStrategy) console.log(`Budget Strategy: ${mealPlan.budgetStrategy}`);
    
    console.log(`\n--- SHOPPING LIST (${finalShoppingList.length} items) ---`);
    finalShoppingList.forEach((item: any) => {
        console.log(`- ${item.item}: ${item.quantity}`);
    });
    
    return mealPlan.estimatedCost;
  } catch (err: any) {
    console.error('Error during generation:', err.message || err);
    return null;
  }
}

async function runAll() {
  // Test 1: Minimal Pantry
  console.log("RUNNING MINIMAL PANTRY SCENARIO...");
  const minCost = await runScenario("Minimal Pantry", 30000, "Rice", "2", false);

  // Test 2: Medium Pantry
  console.log("RUNNING MEDIUM PANTRY SCENARIO...");
  const medCost = await runScenario("Medium Pantry", 30000, "Rice, Beans, Pepper, Onions", "2", false);

  // Test 3: Heavy Pantry
  console.log("RUNNING HEAVY PANTRY SCENARIO...");
  const heavyCost = await runScenario("Heavy Pantry", 30000, "Rice, Beans, Pepper, Onions, Tomato, Garri, Yam, Eggs, Plantain, Bread, Crayfish, Fish", "2", false);

  console.log(`\n\n======================================================`);
  console.log(`PANTRY SCALING AUDIT RESULTS:`);
  console.log(`Minimal Pantry Cost: NGN ${minCost}`);
  console.log(`Medium Pantry Cost: NGN ${medCost}`);
  console.log(`Heavy Pantry Cost: NGN ${heavyCost}`);
  console.log(`======================================================`);
}

runAll().catch(console.error);

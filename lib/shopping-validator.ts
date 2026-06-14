import { ShoppingListEntry, MealPlanDay } from './quantity-validator';

// A dictionary mapping a required ingredient to a list of acceptable pantry substitutes
const SUBSTITUTIONS: Record<string, string[]> = {
  'vegetable oil': ['palm oil', 'groundnut oil', 'oil'],
  'palm oil': ['vegetable oil', 'groundnut oil', 'oil'],
  'groundnut oil': ['vegetable oil', 'palm oil', 'oil'],
  'beef': ['chicken', 'fish', 'turkey', 'goat meat', 'cow meat', 'assorted'],
  'chicken': ['beef', 'fish', 'turkey', 'goat meat', 'cow meat', 'assorted'],
  'fish': ['beef', 'chicken', 'turkey', 'sardine', 'stockfish', 'dry fish', 'smoked fish'],
  'yam': ['potato', 'plantain', 'sweet potato'],
  'potato': ['yam', 'plantain', 'sweet potato'],
  'plantain': ['yam', 'potato', 'sweet potato'],
  'maggi': ['seasoning', 'knorr', 'royco'],
  'seasoning': ['maggi', 'knorr', 'royco'],
  'salt': ['seasoning'],
  'pepper': ['habanero', 'tatashe', 'rodo', 'shombo', 'dry pepper'],
  'tomato': ['tomato paste', 'tin tomato', 'tinned tomatoes'],
  'tomato paste': ['tomato', 'fresh tomatoes'],
  'onions': ['spring onions'],
  'crayfish': ['dry fish', 'smoked fish', 'stockfish'],
  'garri': ['fufu', 'amala', 'semo', 'semolina', 'wheat'],
  'fufu': ['garri', 'amala', 'semo', 'semolina', 'wheat'],
  'semo': ['garri', 'fufu', 'amala', 'semolina', 'wheat'],
  'semolina': ['garri', 'fufu', 'amala', 'semo', 'wheat'],
  'wheat': ['garri', 'fufu', 'amala', 'semo', 'semolina'],
  'amala': ['garri', 'fufu', 'semo', 'semolina', 'wheat'],
};

// Common staples that don't need strict validation as they are assumed available in most homes or cheap
const IGNORED_STAPLES = ['water', 'salt', 'maggi', 'seasoning', 'oil', 'spice', 'curry', 'thyme', 'garlic', 'ginger', 'knorr', 'bouillon', 'cube'];

export function enrichShoppingList(
  mealPlan: MealPlanDay[],
  availableIngredientsStr: string,
  shoppingList: ShoppingListEntry[]
): void {
  const availableItemsLower = availableIngredientsStr.toLowerCase();
  
  // Extract all primary ingredients needed across all days
  const allRequiredIngredients = new Set<string>();
  mealPlan.forEach(day => {
    day.primaryIngredientsUsed.forEach(ing => allRequiredIngredients.add(ing.toLowerCase().trim()));
  });

  const userPantryList = availableItemsLower.split(',').map(i => i.trim()).filter(i => i.length > 0);

  // --- PASS 1: RUTHLESS PRUNING ---
  // Iterate backwards so we can safely splice/remove items from the array
  for (let i = shoppingList.length - 1; i >= 0; i--) {
    const itemEntry = shoppingList[i];
    const itemLower = itemEntry.item.toLowerCase();

    // 1A. Direct Match: Does the user already have this exact item or a close variant?
    let shouldPrune = userPantryList.some(p => itemLower.includes(p) || p.includes(itemLower));

    // 1B. Substitution Match: Does the user have a valid substitute?
    if (!shouldPrune) {
      for (const [key, substitutes] of Object.entries(SUBSTITUTIONS)) {
        // If the shopping item is the key or related to the key
        if (itemLower.includes(key) || key.includes(itemLower)) {
          // If the user has one of the substitutes in their pantry
          const hasSubstitute = substitutes.some(sub => userPantryList.some(p => sub.includes(p) || p.includes(sub)));
          if (hasSubstitute) {
            shouldPrune = true;
            break;
          }
        }
      }
    }

    if (shouldPrune) {
      shoppingList.splice(i, 1);
    }
  }

  // --- PASS 2: ENRICHMENT ---
  // Now we check if any required ingredients are entirely missing (not in pantry AND not in shopping list)
  for (const reqIng of Array.from(allRequiredIngredients)) {
    // 1. Skip if it's a common ignored staple
    if (IGNORED_STAPLES.some(ignored => reqIng.includes(ignored))) {
      continue;
    }

    // 2. Check if present in available ingredients (using robust substring matching)
    if (userPantryList.some(p => reqIng.includes(p) || p.includes(reqIng))) {
      continue;
    }

    // 3. Check if present in current shopping list
    const foundInShoppingList = shoppingList.some(item => {
      const itemLower = item.item.toLowerCase();
      return itemLower.includes(reqIng) || reqIng.includes(itemLower);
    });
    
    if (foundInShoppingList) {
      continue;
    }

    // 4. Check Ingredient Substitution
    let validSubstituteFound = false;
    
    // Find any key in the substitution dictionary that matches the required ingredient
    for (const [key, substitutes] of Object.entries(SUBSTITUTIONS)) {
      if (reqIng.includes(key) || key.includes(reqIng)) {
        // Check if any of its substitutes exist in the pantry
        const hasSubstitute = substitutes.some(sub => userPantryList.some(p => sub.includes(p) || p.includes(sub)));
        if (hasSubstitute) {
          validSubstituteFound = true;
          break;
        }
      }
    }

    if (validSubstituteFound) {
      continue;
    }

    // 5. If it's truly missing (not in pantry, not in shopping list, no substitute), add it!
    shoppingList.push({
      item: reqIng.charAt(0).toUpperCase() + reqIng.slice(1),
      quantity: 'To be calculated' // This will be fixed by the quantity-validator
    });
  }
}

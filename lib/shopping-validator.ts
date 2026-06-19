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

export function pruneShoppingList(
  availableIngredientsStr: string,
  shoppingList: ShoppingListEntry[]
): void {
  const availableItemsLower = availableIngredientsStr.toLowerCase();
  const userPantryList = availableItemsLower.split(',').map(i => i.trim()).filter(i => i.length > 0);

  // Helper to normalize strings (basic singularization for robust matching)
  const normalize = (str: string) => str.replace(/(es|s)$/i, '').trim();

  // --- PASS 1: RUTHLESS PRUNING ---
  // Iterate backwards so we can safely splice/remove items from the array
  for (let i = shoppingList.length - 1; i >= 0; i--) {
    const itemEntry = shoppingList[i];
    const itemLower = itemEntry.item.toLowerCase();
    const itemNorm = normalize(itemLower);

    // 1A. Direct Match: Does the user already have this exact item or a close variant?
    let shouldPrune = userPantryList.some(p => {
      const pNorm = normalize(p);
      // Prevent 'vegetable' from matching 'vegetable oil'
      if (itemNorm === 'vegetable' && pNorm.includes('oil')) return false;
      return itemNorm.includes(pNorm) || pNorm.includes(itemNorm);
    });

    // 1B. Substitution Match: Does the user have a valid substitute?
    if (!shouldPrune) {
      for (const [key, substitutes] of Object.entries(SUBSTITUTIONS)) {
        const keyNorm = normalize(key);
        // Prevent 'vegetable' from accidentally matching the 'vegetable oil' key
        const isMatch = itemNorm.includes(keyNorm) || keyNorm.includes(itemNorm);
        if (isMatch && itemNorm === 'vegetable' && keyNorm.includes('oil')) {
          continue; // Skip this key, do not prune vegetable just because of vegetable oil
        }
        
        if (isMatch) {
          // If the user has one of the substitutes in their pantry
          const hasSubstitute = substitutes.some(sub => {
             const subNorm = normalize(sub);
             return userPantryList.some(p => {
               const pNorm = normalize(p);
               return subNorm.includes(pNorm) || pNorm.includes(subNorm);
             });
          });
          
          if (hasSubstitute) {
            shouldPrune = true;
            break;
          }
        }
      }
    }

    // 1C. Trivial Items / Staples (Water, Salt, Seasoning)
    if (!shouldPrune) {
       if (IGNORED_STAPLES.some(ignored => itemNorm.includes(normalize(ignored)))) {
           shouldPrune = true;
       }
    }

    if (shouldPrune) {
      shoppingList.splice(i, 1);
    }
  }
}

/**
 * Removes items from the shopping list that are completely hallucinated by the AI
 * (i.e., not a base ingredient and not mentioned anywhere in the meal plan text).
 */
export function pruneUnusedShoppingItems(
  shoppingList: ShoppingListEntry[],
  mealPlan: MealPlanDay[]
): void {
  // Combine all meal text into one large string for easy searching
  const allMealsText = mealPlan
    .map(day => `${day.breakfast} ${day.lunch} ${day.dinner}`)
    .join(' ')
    .toLowerCase();

  // Helper to normalize strings (basic singularization for robust matching)
  const normalize = (str: string) => str.replace(/(es|s)$/i, '').trim();

  // List of base cooking ingredients that don't need to be explicitly mentioned
  // in the meal text (e.g. you don't always say "Jollof Rice with Onions")
  const BASE_INGREDIENTS = [
    'water', 'salt', 'maggi', 'seasoning', 'oil', 'spice', 'curry', 'thyme', 
    'garlic', 'ginger', 'knorr', 'bouillon', 'cube', 'onion', 'tomato', 'pepper',
    'crayfish', 'palm oil', 'groundnut oil', 'vegetable oil', 'habanero', 'tatashe'
  ];

  for (let i = shoppingList.length - 1; i >= 0; i--) {
    const itemEntry = shoppingList[i];
    const itemLower = itemEntry.item.toLowerCase();
    const itemNorm = normalize(itemLower);

    // 1. Check if it's a base ingredient (we keep these even if not explicitly named)
    const isBaseIngredient = BASE_INGREDIENTS.some(base => 
      itemNorm.includes(normalize(base)) || normalize(base).includes(itemNorm)
    );

    if (isBaseIngredient) {
      continue; // Keep it
    }

    // 2. Check if the item is mentioned ANYWHERE in the meal plan text
    const words = itemNorm.split(' ').filter(w => w.length > 2);
    let isMentioned = allMealsText.includes(itemNorm);
    
    if (!isMentioned && words.length > 0) {
       // Fuzzy match: if any significant word of the item is in the meal text
       isMentioned = words.some(word => allMealsText.includes(word));
    }

    if (!isMentioned) {
      // The item is an orphan (not a base ingredient, and not mentioned in the meals)
      // So we prune it from the shopping list
      shoppingList.splice(i, 1);
    }
  }
}

import { MealPlanDay } from './quantity-validator';

// A predefined list of budget-friendly, common Nigerian meals to use as fallback substitutes.
// We categorize them so we can replace a breakfast with a breakfast, etc.
export type MealAlternative = { name: string; ingredients: string[]; type: 'breakfast' | 'main' };

export const FALLBACK_MEALS: MealAlternative[] = [
  { name: 'Oats and Milk', ingredients: ['oats', 'milk', 'sugar'], type: 'breakfast' },
  { name: 'Pap and Akara', ingredients: ['beans', 'oil', 'pap'], type: 'breakfast' },
  { name: 'Bread and Fried Eggs', ingredients: ['bread', 'eggs', 'oil'], type: 'breakfast' },
  { name: 'Soaked Garri with Groundnut', ingredients: ['garri', 'groundnut', 'sugar', 'milk'], type: 'breakfast' },
  { name: 'Yam and Egg Sauce', ingredients: ['yam', 'eggs', 'onions', 'pepper', 'oil'], type: 'breakfast' },
  { name: 'Moi Moi and Pap', ingredients: ['beans', 'oil', 'onions', 'pepper', 'pap'], type: 'breakfast' },
  
  { name: 'Jollof Rice', ingredients: ['rice', 'tomatoes', 'pepper', 'oil', 'onions', 'maggi'], type: 'main' },
  { name: 'White Rice and Stew', ingredients: ['rice', 'tomatoes', 'pepper', 'oil', 'onions'], type: 'main' },
  { name: 'Beans Porridge', ingredients: ['beans', 'palm oil', 'onions', 'pepper', 'crayfish'], type: 'main' },
  { name: 'Yam Porridge', ingredients: ['yam', 'palm oil', 'crayfish', 'pepper', 'onions', 'spinach'], type: 'main' },
  { name: 'Spaghetti Stir-fry', ingredients: ['spaghetti', 'oil', 'onions', 'pepper', 'carrots'], type: 'main' },
  { name: 'Eba and Okra Soup', ingredients: ['garri', 'okra', 'palm oil', 'crayfish', 'pepper'], type: 'main' },
  { name: 'Eba and Egusi Soup', ingredients: ['garri', 'egusi', 'palm oil', 'spinach', 'pepper'], type: 'main' },
  { name: 'Beans and Fried Plantain', ingredients: ['beans', 'plantain', 'palm oil', 'oil'], type: 'main' },
  { name: 'Coconut Rice', ingredients: ['rice', 'coconut', 'oil', 'onions', 'maggi'], type: 'main' },
];

export function enforceMealVariety(mealPlan: MealPlanDay[], availableIngredientsStr: string): void {
  const availableItemsLower = availableIngredientsStr.toLowerCase();
  
  const mealCounts: Record<string, number> = {};

  // Track the previous day's meals to prevent consecutive repeats
  let yesterdayMeals: { breakfast: string; lunch: string; dinner: string } | null = null;

  const isLeftover = (mealName: string): boolean => {
    return /leftover|remaining|from previous( night| day)?/i.test(mealName) || /fresh /i.test(mealName);
  };

  const getCoreMealName = (mealName: string): string => {
    // Strip descriptive words to get the base meal identity
    return mealName
      .replace(/\b(leftover|remaining|from previous( night| day)?|the|some|of|warmed up|warmed|fresh|with|and)\b/gi, '')
      .replace(/\b(fried fish|chicken|beef|meat|fish|goat meat)\b/gi, '') // Strip common proteins as they don't change the base meal identity
      .replace(/\b(stew|sauce)\b/gi, '')
      .trim()
      .toLowerCase();
  };

  for (let dayIndex = 0; dayIndex < mealPlan.length; dayIndex++) {
    const day = mealPlan[dayIndex];
    
    const todayMeals = {
      breakfast: getCoreMealName(day.breakfast),
      lunch: getCoreMealName(day.lunch),
      dinner: getCoreMealName(day.dinner)
    };

    const slots: Array<{ key: 'breakfast' | 'lunch' | 'dinner', name: string, coreName: string, type: 'breakfast' | 'main' }> = [
      { key: 'breakfast', name: day.breakfast, coreName: todayMeals.breakfast, type: 'breakfast' },
      { key: 'lunch', name: day.lunch, coreName: todayMeals.lunch, type: 'main' },
      { key: 'dinner', name: day.dinner, coreName: todayMeals.dinner, type: 'main' }
    ];

    for (const slot of slots) {
      if (isLeftover(slot.name)) {
        // Leftovers are inherently repetitive but are allowed for budget efficiency.
        // We only track fresh meal variety.
        continue;
      }

      if (slot.coreName.length < 3) continue; // Ignore empty or malformed strings

      mealCounts[slot.coreName] = (mealCounts[slot.coreName] || 0) + 1;

      // Check Rule 1 (Consecutive Penalty) & Rule 2 (Usage Cap)
      let needsReplacement = false;

      const maxAllowed = slot.type === 'breakfast' ? 2 : 3;

      // If it exceeds the maximum weekly appearances
      if (mealCounts[slot.coreName] > maxAllowed) {
        needsReplacement = true;
      }
      
      // If it exactly matches yesterday's slot
      if (yesterdayMeals && yesterdayMeals[slot.key] === slot.coreName) {
        needsReplacement = true;
      }

      if (needsReplacement) {
        // Find a suitable replacement
        // Score alternatives based on how many ingredients the user already has
        const scoredAlternatives = FALLBACK_MEALS
          .filter(alt => alt.type === slot.type) // Match meal type (breakfast vs main)
          .map(alt => {
            const matchCount = alt.ingredients.filter(ing => availableItemsLower.includes(ing)).length;
            const coreAltName = getCoreMealName(alt.name);
            // Penalize alternatives that have already been used too much
            const usagePenalty = (mealCounts[coreAltName] || 0) * 2;
            const score = matchCount - usagePenalty;
            return { ...alt, score, coreAltName };
          })
          .sort((a, b) => b.score - a.score);

        // Pick the best alternative
        const bestAlternative = scoredAlternatives[0];

        if (bestAlternative) {
          // Perform Replacement
          day[slot.key] = bestAlternative.name;
          
          // Inject new ingredients into the day's primaryIngredientsUsed so the shopping list validator catches them
          bestAlternative.ingredients.forEach(ing => {
            if (!day.primaryIngredientsUsed.some((existing: string) => existing.toLowerCase().includes(ing.toLowerCase()))) {
              day.primaryIngredientsUsed.push(ing);
            }
          });

          // Update tracking
          mealCounts[bestAlternative.coreAltName] = (mealCounts[bestAlternative.coreAltName] || 0) + 1;
          
          // Decrement old count so we don't permanently ban the old meal if we replaced it
          mealCounts[slot.coreName]--;
          
          // Update todayMeals for the next slot checking
          todayMeals[slot.key] = bestAlternative.coreAltName;
        }
      }
    }

    yesterdayMeals = todayMeals;
  }
}

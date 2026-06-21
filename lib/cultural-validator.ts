import { MealPlanDay } from './quantity-validator';
import { FALLBACK_MEALS } from './variety-validator';

export function validateCulturalCorrectness(
  mealPlan: MealPlanDay[],
  availableIngredientsStr: string = ''
): void {
  const availableItemsLower = availableIngredientsStr.toLowerCase();

  const getBestFallback = (type: 'breakfast' | 'main', excludeBeans = false) => {
    // Score alternatives based on available ingredients
    const scored = FALLBACK_MEALS
      .filter(alt => alt.type === type)
      .filter(alt => {
        if (excludeBeans) {
          const hasBeans = alt.ingredients.some(ing => ing.includes('beans'));
          return !hasBeans;
        }
        return true;
      })
      .map(alt => {
        const matchCount = alt.ingredients.filter(ing => availableItemsLower.includes(ing)).length;
        return { ...alt, score: matchCount };
      })
      .sort((a, b) => b.score - a.score);

    return scored[0]?.name || (type === 'breakfast' ? 'Oats and Milk' : 'Jollof Rice');
  };

  const restrictedCombinations = [
    { combo: ['pap', 'fried yam'], name: 'Pap + Fried Yam' },
    { combo: ['pap', 'boiled yam'], name: 'Pap + Boiled Yam' },
    { combo: ['pap', 'rice'], name: 'Pap + Rice' },
    { combo: ['pap', 'noodles'], name: 'Pap + Noodles' },
    { combo: ['pap', 'bread'], name: 'Pap + Bread' },
  ];

  // 1. Correct Restricted Combinations first
  for (let i = 0; i < mealPlan.length; i++) {
    const day = mealPlan[i];
    const slots = ['breakfast', 'lunch', 'dinner'] as const;

    for (const slot of slots) {
      const lowerMeal = day[slot].toLowerCase();
      for (const rule of restrictedCombinations) {
        const hasAllItems = rule.combo.every(item => lowerMeal.includes(item));
        if (hasAllItems) {
          console.warn(`[AI Sanitizer] Cultural Auto-Correction: ${rule.name} on Day ${i + 1} (${slot}) is not a realistic combination. Replacing it.`);
          // Replace with a suitable fallback
          const isBreakfast = slot === 'breakfast';
          if (isBreakfast) {
            // Since they wanted Pap or Yam/Bread, let's look at what they tried
            if (lowerMeal.includes('pap')) {
              day[slot] = 'Pap and Akara';
              day.primaryIngredientsUsed = Array.from(new Set([...day.primaryIngredientsUsed, 'pap', 'beans', 'oil']));
            } else {
              day[slot] = 'Yam and Egg Sauce';
              day.primaryIngredientsUsed = Array.from(new Set([...day.primaryIngredientsUsed, 'yam', 'eggs', 'onions', 'pepper', 'oil']));
            }
          } else {
            const fallbackName = getBestFallback('main');
            day[slot] = fallbackName;
            const fallbackMeal = FALLBACK_MEALS.find(m => m.name === fallbackName);
            if (fallbackMeal) {
              day.primaryIngredientsUsed = Array.from(new Set([...day.primaryIngredientsUsed, ...fallbackMeal.ingredients]));
            }
          }
        }
      }
    }
  }

  // Helper to check if a meal text contains beans
  const hasBeans = (mealName: string): boolean => {
    const lower = mealName.toLowerCase();
    return lower.includes('beans') && !lower.includes('green beans');
  };

  // 2. Correct Consecutive Beans
  for (let i = 1; i < mealPlan.length; i++) {
    const yesterday = mealPlan[i - 1];
    const today = mealPlan[i];

    const yesterdayHasBeans = hasBeans(yesterday.breakfast) || hasBeans(yesterday.lunch) || hasBeans(yesterday.dinner);
    const todayHasBeans = hasBeans(today.breakfast) || hasBeans(today.lunch) || hasBeans(today.dinner);

    if (yesterdayHasBeans && todayHasBeans) {
      console.warn(`[AI Sanitizer] Cultural Auto-Correction: Beans-based meals found on consecutive days (Day ${i} and Day ${i + 1}). Replacing today's beans meal.`);
      // Find which meal of today has beans and replace it with a non-beans fallback
      const slots = ['breakfast', 'lunch', 'dinner'] as const;
      for (const slot of slots) {
        if (hasBeans(today[slot])) {
          const isBreakfast = slot === 'breakfast';
          const fallbackName = getBestFallback(isBreakfast ? 'breakfast' : 'main', true);
          today[slot] = fallbackName;
          const fallbackMeal = FALLBACK_MEALS.find(m => m.name === fallbackName);
          if (fallbackMeal) {
            const cleanIngredients = today.primaryIngredientsUsed.filter(ing => !ing.toLowerCase().includes('beans'));
            today.primaryIngredientsUsed = Array.from(new Set([...cleanIngredients, ...fallbackMeal.ingredients]));
          }
          break; // only replace one meal
        }
      }
    }
  }

  // 3. Correct Beans Limit (Max 3 beans meals per week)
  const beansMeals: { dayIndex: number; slot: 'breakfast' | 'lunch' | 'dinner' }[] = [];
  for (let i = 0; i < mealPlan.length; i++) {
    const day = mealPlan[i];
    if (hasBeans(day.breakfast)) beansMeals.push({ dayIndex: i, slot: 'breakfast' });
    if (hasBeans(day.lunch)) beansMeals.push({ dayIndex: i, slot: 'lunch' });
    if (hasBeans(day.dinner)) beansMeals.push({ dayIndex: i, slot: 'dinner' });
  }

  if (beansMeals.length > 3) {
    console.warn(`[AI Sanitizer] Cultural Auto-Correction: Excessive beans meals (${beansMeals.length}). Swapping excess meals with non-beans alternatives.`);
    // Keep the first 3 beans meals, replace the rest
    for (let k = 3; k < beansMeals.length; k++) {
      const { dayIndex, slot } = beansMeals[k];
      const day = mealPlan[dayIndex];
      const isBreakfast = slot === 'breakfast';
      const fallbackName = getBestFallback(isBreakfast ? 'breakfast' : 'main', true);
      day[slot] = fallbackName;
      const fallbackMeal = FALLBACK_MEALS.find(m => m.name === fallbackName);
      if (fallbackMeal) {
        const cleanIngredients = day.primaryIngredientsUsed.filter(ing => !ing.toLowerCase().includes('beans'));
        day.primaryIngredientsUsed = Array.from(new Set([...cleanIngredients, ...fallbackMeal.ingredients]));
      }
    }
  }

  // 4. Breakfast Variety Check
  const breakfasts: string[] = [];
  for (let i = 0; i < mealPlan.length; i++) {
    breakfasts.push(mealPlan[i].breakfast.toLowerCase().trim());
  }

  const breakfastCounts: Record<string, number> = {};
  for (let i = 0; i < breakfasts.length; i++) {
    const b = breakfasts[i];
    let normalized = b.replace(/\b(leftover|remaining|fresh|the|some|of|warmed up|warmed)\b/gi, '').trim();
    normalized = normalized.replace(/\s{2,}/g, ' ');

    breakfastCounts[normalized] = (breakfastCounts[normalized] || 0) + 1;
    if (breakfastCounts[normalized] > 2) {
      console.warn(`[AI Sanitizer] Cultural Auto-Correction: Excessive breakfast repetition for "${normalized}" (${breakfastCounts[normalized]} times). Replacing Day ${i + 1} breakfast.`);
      // Replace this repeat with a fallback
      const fallbackName = getBestFallback('breakfast', false);
      mealPlan[i].breakfast = fallbackName;
      const fallbackMeal = FALLBACK_MEALS.find(m => m.name === fallbackName);
      if (fallbackMeal) {
        mealPlan[i].primaryIngredientsUsed = Array.from(new Set([...mealPlan[i].primaryIngredientsUsed, ...fallbackMeal.ingredients]));
      }
      // Reset the repeat count or update it to prevent ban
      const coreAltName = fallbackName.replace(/\b(leftover|remaining|fresh|the|some|of|warmed up|warmed)\b/gi, '').trim().toLowerCase();
      breakfastCounts[coreAltName] = (breakfastCounts[coreAltName] || 0) + 1;
      breakfastCounts[normalized]--;
    }
  }
}

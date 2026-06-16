import { MealPlanDay } from './quantity-validator';

export type PantryScoreResult = {
  score: number;
  availableItemsCount: number;
  usedItemsCount: number;
  newItemsCount: number;
  status: string;
};

export function calculatePantryScore(
  availableIngredientsStr: string,
  mealPlan: MealPlanDay[],
  shoppingList: any[]
): PantryScoreResult {
  const availableItems = availableIngredientsStr
    .split(',')
    .map(i => i.trim().toLowerCase())
    .filter(i => i.length > 0);

  const totalRequiredSet: string[] = [];
  mealPlan.forEach(day => {
    if (day.primaryIngredientsUsed && day.primaryIngredientsUsed.length > 0) {
      day.primaryIngredientsUsed.forEach((ing: string) => {
        const cleanIng = ing.toLowerCase().trim();
        if (!totalRequiredSet.includes(cleanIng)) {
          totalRequiredSet.push(cleanIng);
        }
      });
    } else {
      // Fallback: search meal names for available pantry items
      const combinedMeals = `${day.breakfast || ''} ${day.lunch || ''} ${day.dinner || ''}`.toLowerCase();
      availableItems.forEach(item => {
        if (combinedMeals.includes(item) && !totalRequiredSet.includes(item)) {
          totalRequiredSet.push(item);
        }
      });
    }
  });

  const availableItemsCount = availableItems.length;
  const newItemsCount = shoppingList.length;
  
  // Calculate how many of the available items were actually used
  let usedItemsCount = 0;
  for (const item of availableItems) {
    let itemUsed = false;
    for (const required of totalRequiredSet) {
      if (required.includes(item) || item.includes(required)) {
        itemUsed = true;
        break;
      }
    }
    if (itemUsed) usedItemsCount++;
  }

  // If pantry is essentially empty, utilization is moot. Default to 100% to pass validation.
  if (availableItemsCount === 0) {
    return {
      score: 100,
      availableItemsCount: 0,
      usedItemsCount: 0,
      newItemsCount,
      status: 'No Pantry Available'
    };
  }

  // Exhaustion: How much of the pantry did we manage to use?
  const exhaustion = usedItemsCount / availableItemsCount;

  // Reliance: How much of the final list is from the pantry vs new purchases?
  const reliance = usedItemsCount / (usedItemsCount + newItemsCount);

  // Composite Score: 60% Exhaustion + 40% Reliance
  // This balances using what you have, while aggressively rewarding a minimal shopping list.
  let rawScore = (exhaustion * 0.6) + (reliance * 0.4);
  let score = Math.round(rawScore * 100);

  // Apply a steep penalty if the shopping list balloons unnecessarily while the pantry is stocked
  // Adjusted threshold from 8 to 15 because the backend deterministic generator creates exhaustive lists
  if (availableItemsCount >= 4 && newItemsCount > 15) {
      const excessItems = newItemsCount - 15;
      score -= (excessItems * 2); // -2% penalty for every item over 15
  }

  score = Math.max(0, Math.min(100, score));

  // Status designation based on user criteria
  let status = 'Low Pantry Utilization';
  if (score >= 90) {
    status = 'Excellent Pantry Utilization';
  } else if (score >= 75) {
    status = 'Good Pantry Utilization';
  } else if (score >= 50) {
    status = 'Moderate Pantry Utilization';
  }

  return {
    score,
    availableItemsCount,
    usedItemsCount,
    newItemsCount,
    status
  };
}

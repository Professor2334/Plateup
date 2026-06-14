import { MealPlanDay } from './quantity-validator';

export function validateAndSanitizeLeftovers(mealPlan: MealPlanDay[]): void {
  // A rolling history of all meals prepared so far. 
  // We store the base meal name to check against future leftovers.
  const timeline: string[] = [];
  
  // Track how many times a source meal has been used as a leftover
  // to prevent a single meal from feeding the house forever.
  const leftoverUsageCount: Record<string, number> = {};

  // Maximum allowed leftover portions per cooked meal.
  // E.g., 2 means a dinner can be eaten for breakfast and maybe one lunch, but no more.
  const MAX_LEFTOVER_REUSE = 2;

  const isLeftover = (mealName: string): boolean => {
    return /leftover|remaining|from previous( night| day)?/i.test(mealName);
  };

  const getCoreMealName = (leftoverName: string): string => {
    return leftoverName.replace(/leftover|remaining|from previous( night| day)?|the|some|of|warmed up|warmed/gi, '').trim();
  };

  for (let dayIndex = 0; dayIndex < mealPlan.length; dayIndex++) {
    const day = mealPlan[dayIndex];
    
    // Process meals in chronological order
    const meals = [
      { key: 'breakfast' as const, name: day.breakfast },
      { key: 'lunch' as const, name: day.lunch },
      { key: 'dinner' as const, name: day.dinner }
    ];

    for (const meal of meals) {
      if (isLeftover(meal.name)) {
        // Rule 1: Day 1 Breakfast can never be a leftover
        if (dayIndex === 0 && meal.key === 'breakfast') {
          day[meal.key] = `Fresh ${getCoreMealName(meal.name) || 'Meal'}`;
          timeline.push(day[meal.key].toLowerCase());
          continue;
        }

        const coreName = getCoreMealName(meal.name).toLowerCase();
        
        // Find the most recent matching source meal in the timeline
        // The source meal should not be a leftover itself.
        const sourceMeal = timeline.slice().reverse().find(pastMeal => pastMeal.includes(coreName) || coreName.includes(pastMeal));

        if (!sourceMeal) {
          // Rule 2 & 3: Source meal doesn't exist in history. Sanitize it.
          day[meal.key] = `Fresh ${getCoreMealName(meal.name)}`;
          timeline.push(day[meal.key].toLowerCase());
        } else {
          // Rule 4: Verify Quantity/Usage limit
          leftoverUsageCount[sourceMeal] = (leftoverUsageCount[sourceMeal] || 0) + 1;
          
          if (leftoverUsageCount[sourceMeal] > MAX_LEFTOVER_REUSE) {
             // Exceeded realistic leftover limit. Sanitize.
             day[meal.key] = `Fresh ${getCoreMealName(meal.name)}`;
             timeline.push(day[meal.key].toLowerCase());
          } else {
             // Valid leftover! We don't add leftovers to the timeline as "source" meals.
          }
        }
      } else {
        // It's a fresh meal. Add to timeline.
        timeline.push(meal.name.toLowerCase());
      }
    }
  }
}

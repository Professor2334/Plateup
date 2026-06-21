/* eslint-disable prefer-const */
import { MealPlanDay } from './quantity-validator';

export function validateAndSanitizeLeftovers(mealPlan: MealPlanDay[]): void {
  // A rolling history of all meals prepared so far. 
  // We store the base meal name and the dayIndex it was cooked to check chronological proximity.
  const timeline: { name: string; dayIndex: number }[] = [];
  
  // Track how many times a source meal has been used as a leftover
  // to prevent a single meal from feeding the house forever.
  const leftoverUsageCount: Record<string, number> = {};

  // Maximum allowed leftover portions per cooked meal.
  const MAX_LEFTOVER_REUSE = 2;

  const isLeftover = (mealName: string): boolean => {
    return /leftover|remaining|from previous( night| day)?/i.test(mealName);
  };

  const getCoreMealName = (leftoverName: string): string => {
    // Strip common leftover phrases, including specific days of the week
    let core = leftoverName.replace(/\b(leftover|remaining|from previous( night| day)?|the|some|of|warmed up|warmed|from monday|from tuesday|from wednesday|from thursday|from friday|from saturday|from sunday)\b/gi, '').trim();
    // Also strip dangling parentheses like "( from Wednesday)" or "( Okra)" if the inside is empty or irrelevant
    core = core.replace(/\(\s*\)|\(\s*from\s*\)/gi, '').trim();
    // Clean up double spaces
    return core.replace(/\s{2,}/g, ' ');
  };



  // Helper to completely strip parentheses for a cleaner "Fresh X" label
  const getCleanFreshName = (mealName: string): string => {
     const clean = getCoreMealName(mealName).replace(/\s*\([^)]*\)\s*/g, '').trim();
     return clean || 'Meal';
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
          day[meal.key] = getCleanFreshName(meal.name);
          timeline.push({ name: day[meal.key].toLowerCase(), dayIndex });
          continue;
        }

        const coreName = getCoreMealName(meal.name).toLowerCase();
        
        // Find the most recent matching source meal in the timeline
        const reversedTimeline = timeline.slice().reverse();
        const sourceMealObj = reversedTimeline.find(pastMeal => pastMeal.name.includes(coreName) || coreName.includes(pastMeal.name));

        if (!sourceMealObj) {
          // Rule 2 & 3: Source meal doesn't exist in history. Sanitize it.
          day[meal.key] = getCleanFreshName(meal.name);
          timeline.push({ name: day[meal.key].toLowerCase(), dayIndex });
        } else {
          // Freshness check: Is the leftover more than 1 day old?
          const ageInDays = dayIndex - sourceMealObj.dayIndex;
          if (ageInDays > 1) {
             // Too old to be a realistic leftover! Sanitize.
             day[meal.key] = getCleanFreshName(meal.name);
             timeline.push({ name: day[meal.key].toLowerCase(), dayIndex });
             continue;
          }

          // Rule 4: Verify Quantity/Usage limit
          leftoverUsageCount[sourceMealObj.name] = (leftoverUsageCount[sourceMealObj.name] || 0) + 1;
          
          if (leftoverUsageCount[sourceMealObj.name] > MAX_LEFTOVER_REUSE) {
             // Exceeded realistic leftover limit. Sanitize.
             day[meal.key] = getCleanFreshName(meal.name);
             timeline.push({ name: day[meal.key].toLowerCase(), dayIndex });
          } else {
             // Valid leftover! We don't add leftovers to the timeline as "source" meals.
          }
        }
      } else {
        // It's a fresh meal. Add to timeline.
        timeline.push({ name: meal.name.toLowerCase(), dayIndex });
      }
    }
  }
}

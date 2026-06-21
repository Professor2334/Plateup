export type ValidationStatus = 'VALID' | 'LIMITED' | 'UNREALISTIC';

export interface ValidationResult {
  status: ValidationStatus;
  message?: string;
  reason?: 'BUDGET_TOO_LOW' | 'PANTRY_TOO_SMALL' | 'BUDGET_AND_PANTRY_LIMITATION' | 'LARGE_HOUSEHOLD_LOW_BUDGET';
}

/**
 * Validates meal plan inputs before sending to the AI.
 * Thresholds based on household size, budget, and pantry ingredient count.
 */
export function validateMealPlanInputs(
  budget: number,
  householdSize: string,
  ingredientsCount: number
): ValidationResult {
  const getHouseholdMultiplier = (size: string) => {
    if (size.includes('-')) return parseInt(size.split('-')[0], 10);
    if (size.includes('+')) return parseInt(size.replace('+', ''), 10);
    return parseInt(size, 10) || 1;
  };


  // For PlateUp, "3-4" is typically parsed as 3. Let's explicitly check the raw string for our thresholds:
  let category: '1' | '2-3' | '4-5' | '5+' = '1';
  const multiplier = getHouseholdMultiplier(householdSize);
  
  if (multiplier === 1) category = '1';
  else if (multiplier === 2 || multiplier === 3) category = '2-3';
  else if (multiplier === 4 || multiplier === 5) category = '4-5';
  else if (multiplier >= 5 || householdSize.includes('5+')) category = '5+';

  // 1. UNREALISTIC CHECKS (Block generation)
  if (category === '1' && budget < 7000) {
    return { status: 'UNREALISTIC', message: "Your budget may be too low for a balanced weekly meal plan. Try increasing your budget or adding more pantry ingredients to unlock more meal options.", reason: 'BUDGET_TOO_LOW' };
  }
  if (category === '2-3' && budget < 12000) {
    return { status: 'UNREALISTIC', message: "Your budget may be too low for a balanced weekly meal plan. Try increasing your budget or adding more pantry ingredients to unlock more meal options.", reason: 'BUDGET_TOO_LOW' };
  }
  if (category === '4-5' && budget < 20000) {
    return { status: 'UNREALISTIC', message: "Your budget may be too low for the selected household size. Increase your budget or reduce household size to generate a realistic weekly meal plan.", reason: 'LARGE_HOUSEHOLD_LOW_BUDGET' };
  }
  if (category === '5+' && budget < 25000) {
    return { status: 'UNREALISTIC', message: "Your budget may be too low for the selected household size. Increase your budget or reduce household size to generate a realistic weekly meal plan.", reason: 'LARGE_HOUSEHOLD_LOW_BUDGET' };
  }

  // Generic extremely low pantry checks combined with low budgets for Unrealistic (user examples)
  // The user defined unrealistic solely based on budget floors for now, but also requested:
  // "Very few pantry ingredients. Do NOT call the AI. Show one of the following guidance messages... Pantry Too Small..."
  // If the user wants specific Pantry Too Small unrealistic logic, I will implement a general fail-safe:
  if (ingredientsCount < 2 && budget < 10000) {
    return { status: 'UNREALISTIC', message: "Your current budget and pantry items may be too limited for a complete weekly meal plan. Try increasing your budget, adding more pantry ingredients, or adjusting your household size.", reason: 'BUDGET_AND_PANTRY_LIMITATION' };
  }

  // 2. LIMITED CHECKS (Show warning, but continue)
  let isLimited = false;
  if (category === '1' && budget < 15000 && ingredientsCount < 2) isLimited = true;
  if (category === '2-3' && budget < 25000 && ingredientsCount < 3) isLimited = true;
  if (category === '4-5' && budget < 40000 && ingredientsCount < 4) isLimited = true;
  if (category === '5+' && budget < 60000 && ingredientsCount < 5) isLimited = true;

  if (isLimited) {
    return { 
      status: 'LIMITED', 
      message: "Your meal plan may be limited based on your current budget and available ingredients. For more variety, consider increasing your budget or adding more pantry items." 
    };
  }

  // 3. VALID (All good)
  return { status: 'VALID' };
}

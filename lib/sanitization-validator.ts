import { MealPlanDay } from './quantity-validator';
import { normalizeMealName } from './meal-name-normalizer';

const FORBIDDEN_PHRASES = [
  '?',
  'instead',
  'use',
  'add to list',
  'maybe',
  'if budget allows',
  'consider',
  'not typical',
  "let's use",
  'should use',
  'budget strategy'
];

/**
 * Validates and sanitizes the output meals across all 7 days.
 * @param mealPlan The 7-day meal plan to sanitize.
 * @throws Error if any meal contains forbidden reasoning phrases.
 */
export function validateAndSanitizeOutput(mealPlan: MealPlanDay[]): void {
  for (const day of mealPlan) {
    const meals = ['breakfast', 'lunch', 'dinner'] as const;
    
    for (const mealType of meals) {
      let mealText = day[mealType] as string;
      
      // 1. Check for Forbidden Phrases
      const lowerMealText = mealText.toLowerCase();
      for (const phrase of FORBIDDEN_PHRASES) {
        // If phrase is just letters/spaces, use word boundaries to avoid matching inside other words (e.g. 'house' matching 'use')
        if (/^[a-z\s]+$/.test(phrase)) {
            const regex = new RegExp(`\\b${phrase}\\b`, 'i');
            if (regex.test(mealText)) {
                throw new Error(`Meal "${mealText}" contains forbidden reasoning phrase: "${phrase}".`);
            }
        } else {
            if (lowerMealText.includes(phrase)) {
              throw new Error(`Meal "${mealText}" contains forbidden reasoning phrase: "${phrase}".`);
            }
        }
      }

      // 2. Clean Parenthetical Notes
      // We strip out parentheses that the AI injects (like "(eggs not in pantry)")
      // We want to allow "(Leftover)" if the leftover validator injected it, but it actually injects " (Leftover)"
      // Let's preserve "(Leftover)" and remove anything else inside parentheses.
      
      // Matches any parenthesis block that is NOT literally "(Leftover)"
      // Note: Leftover validator might not be run yet, or might be run after this. 
      // If we run this first, we can strip all parentheses because Leftover Validator appends " (Leftover)" AFTER.
      // Let's just strip all parentheses to ensure clean UI.
      mealText = mealText.replace(/\s*\([^)]*\)/g, (match) => {
        if (match.toLowerCase().includes('leftover')) {
          return match; // Keep it if it somehow already has a leftover tag
        }
        return '';
      }).trim();

      // 3. Strip Artificial Prefixes
      mealText = normalizeMealName(mealText);

      // Assign the sanitized text back
      day[mealType] = mealText;
    }
  }
}

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
      
      // 1. Remove all parenthetical notes and brackets
      mealText = mealText.replace(/\s*\([^)]*\)/g, '').trim();
      mealText = mealText.replace(/\s*\[[^\]]*\]/g, '').trim();

      // 2. Remove clauses after hyphens or commas if they contain reasoning keywords
      const leakKeywords = ['use', 'using', 'because', 'instead', 'omitted', 'leftover', 'remaining', 'budget', 'pantry', 'note', 'omitting'];
      
      const parts = mealText.split(/[,|\-]/);
      if (parts.length > 1) {
        const hasReasoning = leakKeywords.some(keyword => new RegExp(`\\b${keyword}\\b`, 'i').test(mealText));
        if (hasReasoning) {
            mealText = parts[0].trim();
        }
      }

      // 3. Remove inline reasoning that doesn't use commas/hyphens
      const inlineRegex = new RegExp(`\\s+(?:${leakKeywords.join('|')})\\b.*$`, 'i');
      mealText = mealText.replace(inlineRegex, '').trim();

      // 4. Remove standalone adjectives like "leftover" or "remaining"
      mealText = mealText.replace(/\b(?:leftover|remaining|pantry)\b/gi, '').replace(/\s+/g, ' ').trim();

      // 5. Clean up dangling conjunctions (e.g. "Yam with" -> "Yam")
      mealText = mealText.replace(/\s+(with|and|or)\s*$/i, '').trim();

      // 6. Strip Artificial Prefixes (e.g. "Day 1:", "Breakfast:")
      mealText = normalizeMealName(mealText);

      // 7. Final strict validation: ONLY throw if it STILL looks like a raw reasoning block 
      // (This acts as a final safety net for totally botched generations)
      const lowerMealText = mealText.toLowerCase();
      for (const phrase of FORBIDDEN_PHRASES) {
        if (/^[a-z\s]+$/.test(phrase)) {
            const regex = new RegExp(`\\b${phrase}\\b`, 'i');
            if (regex.test(mealText)) {
                throw new Error(`Meal "${mealText}" STILL contains forbidden reasoning phrase: "${phrase}" after sanitization.`);
            }
        } else {
            if (lowerMealText.includes(phrase)) {
              throw new Error(`Meal "${mealText}" STILL contains forbidden reasoning phrase: "${phrase}" after sanitization.`);
            }
        }
      }



      // Assign the sanitized text back
      day[mealType] = mealText;
    }
  }
}

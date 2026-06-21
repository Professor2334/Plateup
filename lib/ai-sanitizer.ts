/* eslint-disable @typescript-eslint/no-explicit-any */

export function sanitizeMealPlanResponse<T extends { mealPlan: any[] }>(
  validationResult: any
): T {
  if (!validationResult.success) {
    console.error('[AI Sanitizer] Zod Validation Failed:', JSON.stringify(validationResult.error.issues, null, 2));
    throw new Error('AI response did not match the required schema');
  }

  const validatedData = validationResult.data;
  const originalLength = validatedData.mealPlan.length;

  console.log(`[AI Sanitizer] Validation Result: SUCCESS. Original mealPlan length: ${originalLength}`);

  if (originalLength > 7) {
    console.warn(`[AI Sanitizer] Correction Applied: Trimming meal plan from ${originalLength} days to 7 days.`);
    validatedData.mealPlan = validatedData.mealPlan.slice(0, 7);
  } else if (originalLength < 7) {
    console.error(`[AI Sanitizer] Validation Failed: Meal plan length is ${originalLength} (less than 7).`);
    throw new Error('AI response contained fewer than 7 days');
  }

  return validatedData;
}

export function normalizeTerminology(mealText: string): string {
  if (!mealText) return mealText;
  
  const soupKeywords = ['soup', 'egusi', 'okra', 'ogbono', 'vegetable', 'oha', 'bitterleaf', 'ewedu', 'gbegiri'];
  const lowerText = mealText.toLowerCase();
  
  if (lowerText.includes('garri') && !lowerText.includes('soaked') && !lowerText.includes('drinking')) {
    if (soupKeywords.some(k => lowerText.includes(k))) {
      return mealText.replace(/garri/gi, 'Eba');
    }
  }
  
  return mealText;
}

import { SUBSTITUTIONS, IGNORED_STAPLES } from './shopping-validator';

export function validateIngredients(
  pantryStr: string,
  shoppingList: { item: string; quantity: string }[],
  mealPlan: { primaryIngredientsUsed: string[] }[]
) {
  const pantryItems = pantryStr.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
  const shoppingItems = shoppingList.map(s => s.item.toLowerCase().trim());
  
  const normalize = (str: string) => str.replace(/(es|s)$/i, '').trim();
  const allowedItems = [...pantryItems, ...shoppingItems].map(normalize);

  for (const day of mealPlan) {
    for (const ingredient of day.primaryIngredientsUsed) {
      const ingLower = ingredient.toLowerCase().trim();
      const ingNorm = normalize(ingLower);

      // 1. Check if it's an ignored staple
      if (IGNORED_STAPLES.some(s => ingNorm.includes(normalize(s)))) {
        continue;
      }

      // 2. Direct Fuzzy Match
      let isValid = allowedItems.some(allowed => 
        ingNorm.includes(allowed) || allowed.includes(ingNorm)
      );

      // 3. Substitution Match (e.g. AI used "Vegetable Oil", but user has "Palm Oil")
      if (!isValid) {
        for (const [key, substitutes] of Object.entries(SUBSTITUTIONS)) {
          const keyNorm = normalize(key);
          const isMatch = ingNorm.includes(keyNorm) || keyNorm.includes(ingNorm);
          
          if (isMatch && ingNorm === 'vegetable' && keyNorm.includes('oil')) {
            continue; // strict check to avoid 'vegetable' matching 'vegetable oil'
          }
          
          if (isMatch) {
            const hasSubstitute = substitutes.some(sub => {
               const subNorm = normalize(sub);
               return allowedItems.some(allowed => 
                 subNorm.includes(allowed) || allowed.includes(subNorm)
               );
            });
            
            if (hasSubstitute) {
              isValid = true;
              break;
            }
          }
        }
      }

      if (!isValid) {
        console.warn(`[AI Sanitizer] Auto-Correction: Ingredient "${ingredient}" is missing from pantry and shopping list! Automatically adding it.`);
        shoppingList.push({ item: ingredient, quantity: 'As needed' });
        allowedItems.push(ingNorm);
      }
    }
  }
}

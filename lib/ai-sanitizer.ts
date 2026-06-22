/* eslint-disable @typescript-eslint/no-explicit-any */

export function sanitizeMealPlanResponse<T extends { mealPlan: any[] }>(
  validationResult: any,
  mealFrequency: string = '3_meals'
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

  // Enforce Meal Frequency Counts
  for (const day of validatedData.mealPlan) {
    const isLunchEmpty = !day.lunch || day.lunch.trim() === '' || day.lunch.trim().toLowerCase() === 'skip' || day.lunch.trim().toLowerCase() === 'none';
    
    if (mealFrequency === '2_meals' && !isLunchEmpty) {
      console.error(`[AI Sanitizer] Validation Failed: Expected 2 meals, but found non-empty lunch: ${day.lunch}`);
      throw new Error('AI response generated lunch when 2 meals were requested');
    }
    
    if (mealFrequency === '3_meals' && isLunchEmpty) {
      console.error(`[AI Sanitizer] Validation Failed: Expected 3 meals, but found empty lunch on day ${day.day}`);
      throw new Error('AI response missed lunch when 3 meals were requested');
    }
  }

  return validatedData;
}

export function normalizeTerminology(mealText: string): string {
  if (!mealText) return mealText;
  
  // 1. Chain-of-Thought Leakage Auto-Clean (Strip brackets/parentheses content)
  let cleanedText = mealText;
  if (cleanedText.includes('(') || cleanedText.includes('[')) {
    cleanedText = cleanedText.replace(/\s*[([].*?[)\]]\s*/g, ' ').trim();
  }

  // 2. Strict Instructional Keyword Rejection
  // We removed 'leftover' from the crash list because 'Leftover Beans' is a natural phrase.
  // Instead, we will silently strip 'leftover' from the output to keep the UI clean.
  cleanedText = cleanedText.replace(/\bleftovers?\b/gi, '').trim();
  // Capitalize the first letter if we just stripped the first word
  if (cleanedText.length > 0) {
    cleanedText = cleanedText.charAt(0).toUpperCase() + cleanedText.slice(1);
  }

  const leakageRegex = /\b(use|instead|consider|maybe)\b/i;
  if (leakageRegex.test(cleanedText)) {
    console.error(`[AI Sanitizer] Validation Failed: Chain-of-thought leakage detected in meal name: "${mealText}"`);
    throw new Error('AI response contained instructional reasoning in meal names');
  }

  // 3. Nigerian Terminology Normalization
  const soupKeywords = ['soup', 'egusi', 'okra', 'ogbono', 'vegetable', 'oha', 'bitterleaf', 'ewedu', 'gbegiri'];
  const finalLower = cleanedText.toLowerCase();
  
  if (finalLower.includes('garri') && !finalLower.includes('soaked') && !finalLower.includes('drinking')) {
    if (soupKeywords.some(k => finalLower.includes(k))) {
      return cleanedText.replace(/garri/gi, 'Eba');
    }
  }
  
  return cleanedText;
}

import { SUBSTITUTIONS, IGNORED_STAPLES } from './shopping-validator';
import { getFallbackQuantity } from './fallback-quantities';

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
        shoppingList.push({ item: ingredient, quantity: getFallbackQuantity(ingredient) });
        allowedItems.push(ingNorm);
      }
    }
  }

  // 4. Fallback text scanning for missing explicit ingredients
  // The AI sometimes mentions an ingredient in the meal name but forgets to add it to primaryIngredientsUsed
  const allMealsText = (mealPlan as any[])
    .map(day => `${day.breakfast || ''} ${day.lunch || ''} ${day.dinner || ''}`)
    .join(' ')
    .toLowerCase();

  const criticalIngredients = ['crayfish', 'stockfish', 'egg', 'chicken', 'beef', 'plantain', 'fish', 'sardine', 'turkey', 'yam', 'beans'];
  
  for (const expIng of criticalIngredients) {
    if (allMealsText.includes(expIng)) {
       const expNorm = normalize(expIng);
       // check if it's satisfied by pantry or shopping list
       let isCovered = allowedItems.some(allowed => expNorm.includes(allowed) || allowed.includes(expNorm));
       
       if (!isCovered) {
         // Also check substitutions - if the user has a substitute, it's technically covered
         if (SUBSTITUTIONS[expIng]) {
           isCovered = SUBSTITUTIONS[expIng].some(sub => {
             const subNorm = normalize(sub);
             return allowedItems.some(allowed => subNorm.includes(allowed) || allowed.includes(subNorm));
           });
         }
       }
       
       if (!isCovered) {
         console.warn(`[AI Sanitizer] Auto-Correction: Critical ingredient "${expIng}" found in meal text but missing from lists! Adding it.`);
         shoppingList.push({ item: expIng, quantity: getFallbackQuantity(expIng) });
         allowedItems.push(expNorm);
       }
    }
  }
}

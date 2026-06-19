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

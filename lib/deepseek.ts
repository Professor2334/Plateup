import { z } from 'zod';
import fs from 'fs';
import path from 'path';

export const DeepSeekResponseSchema = z.object({
  ingredientUtilization: z.string(),
  mealPlan: z.array(
    z.object({
      day: z.string(),
      breakfast: z.string(),
      lunch: z.string(),
      dinner: z.string(),
      primaryIngredientsUsed: z.array(z.string()),
    })
  ).length(7),
  shoppingList: z.array(
    z.object({
      item: z.string(),
      quantity: z.string(),
    })
  ),
  estimatedCost: z.number(),
  budgetStatus: z.enum(['WITHIN_BUDGET', 'APPROACHING_BUDGET', 'EXCEEDS_BUDGET']),
});

export type MealPlanResponse = z.infer<typeof DeepSeekResponseSchema> & {
  estimatedCostRange?: {
    min: number;
    max: number;
  };
};

export async function generateMealPlan(
  budget: number,
  ingredients: string,
  householdSize: string,
  primaryGoal: string,
  budgetFriendly: boolean = false
): Promise<MealPlanResponse> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY is missing');
  }

  // Read system prompt and schema dynamically to ensure source-of-truth accuracy
  const systemPromptPath = path.join(process.cwd(), '.agent/ai/system-prompt/SKILLS.md');
  const schemaPath = path.join(process.cwd(), '.agent/ai/output-schema/SKILLS.md');
  
  let systemPromptContent = '';
  let schemaContent = '';

  try {
    systemPromptContent = fs.readFileSync(systemPromptPath, 'utf8');
    schemaContent = fs.readFileSync(schemaPath, 'utf8');
  } catch (error) {
    console.error('Failed to read AI configuration files:', error);
    throw new Error('Internal Configuration Error: AI prompts missing.');
  }

  const combinedSystemMessage = `${systemPromptContent}\n\n${schemaContent}`;

  let prompt = `Generate a 7-day budget-aware Nigerian meal plan.
Household Size: ${householdSize}
Goal: ${primaryGoal}
Budget: NGN ${budget}
Available Ingredients: ${ingredients}`;

  if (budgetFriendly) {
    prompt += `\n\nURGENT BUDGET OVERRIDE: The user has requested a budget-friendly alternative. 
You MUST reduce the shopping list size aggressively. 
Reuse pantry ingredients for almost every meal. 
Remove expensive proteins or swap them for affordable alternatives (e.g., eggs, beans, or small fish).
Focus heavily on low-cost Nigerian staples.`;
  }

  // Use AbortController for a 45-second timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: combinedSystemMessage },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown Error');
      console.error('DeepSeek API request failed:', response.status, errorText);
      throw new Error(`DeepSeek API request failed with status ${response.status}`);
    }

    const rawJson = await response.json();
    
    if (!rawJson.choices || rawJson.choices.length === 0 || !rawJson.choices[0].message) {
      throw new Error('DeepSeek API returned an empty or invalid response structure');
    }

    const content = rawJson.choices[0].message.content;
    
    if (!content) {
      throw new Error('DeepSeek API returned empty content');
    }

    // Parse and safely return validated schema
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse DeepSeek JSON response:', content);
      throw new Error('AI returned malformed JSON');
    }

    try {
      return DeepSeekResponseSchema.parse(parsed);
    } catch (validationError) {
      console.error('Zod Validation Error on DeepSeek response:', validationError);
      throw new Error('AI response did not match the required schema');
    }

  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error('DeepSeek API request timed out after 45 seconds');
      throw new Error('Request Timeout: The AI took too long to respond.');
    }
    // Re-throw generic errors to be handled by the Server Action
    throw error;
  }
}

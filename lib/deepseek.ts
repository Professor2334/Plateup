import { z } from 'zod';
import fs from 'fs';
import path from 'path';

export const DeepSeekResponseSchema = z.object({
  budgetStrategy: z.string().optional(),
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
  shoppingListCalculations: z.string(),
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
  budgetUtilization?: number;
};

export async function generateMealPlan(
  budget: number,
  ingredients: string,
  householdSize: string,
  primaryGoal: string,
  budgetFriendly: boolean = false,
  originalEstimatedCost?: number
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
Available Ingredients: ${ingredients}

CRITICAL RULES FOR ALL GENERATIONS:
1. Day 1 (Monday) is the first day. You CANNOT have leftovers on Monday. NEVER use words like "leftover", "remaining", or "from previous" on Day 1.
2. If you suggest a leftover on Days 2-7, the EXACT original meal must have been cooked on an earlier day.`;

  if (budgetFriendly) {
    let budgetContext = `You MUST enter VALUE-OPTIMIZATION MODE.`;
    if (originalEstimatedCost) {
      budgetContext = `Your previous standard recommendation cost NGN ${originalEstimatedCost}, but the user only has NGN ${budget}. You MUST enter VALUE-OPTIMIZATION MODE to fit this budget.`;
    }
    
    prompt += `\n\nURGENT BUDGET OVERRIDE: ${budgetContext}
Rules:
1. Target an 80%-100% budget utilization. Do not generate the cheapest possible plan; generate the BEST value plan within the NGN ${budget} limit.
2. To reach the 80%-100% budget utilization target, you MUST include affordable proteins (e.g., Eggs, Fish, Crayfish) and vegetables to ensure a balanced diet. Only avoid luxury proteins (Beef, Chicken, Turkey) if the budget is tight.
3. Meal repetition is allowed to save money, but do not repeat the exact same meal every single day.
4. Maximize the use of the user's available ingredients first.
5. YOU MUST INCLUDE a \`budgetStrategy\` field at the very top of your JSON. In it, explicitly declare which expensive items (Bread, Yam, large proteins) you will avoid to stay within budget. If you do not avoid them, the quantities will multiply and fail the budget constraint.
6. CRITICAL RULE REGARDING LEFTOVERS: Never create leftovers before a meal exists! Do NOT suggest 'leftovers' on Day 1. Only suggest leftovers if that EXACT meal was cooked on a previous day.`;
  } else {
    prompt += `\n\nRECOMMENDED PLAN MODE:
You are NOT in Value-Optimization mode. Your goal is to generate the highest quality, most realistic Nigerian meal plan possible using the pantry as a base.
CRITICAL RULE: Do NOT artificially cheapen the meal plan or avoid standard ingredients (like Bread, Eggs, Yam) just because the budget is tight. It is completely acceptable for this recommended plan to exceed the user's budget. Focus purely on meal quality and variety.
DO NOT include a \`budgetStrategy\` field in your JSON.`;
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

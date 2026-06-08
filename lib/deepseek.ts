import { z } from 'zod';

export const DeepSeekResponseSchema = z.object({
  mealPlan: z.array(
    z.object({
      day: z.string(),
      breakfast: z.string(),
      lunch: z.string(),
      dinner: z.string(),
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

export type MealPlanResponse = z.infer<typeof DeepSeekResponseSchema>;

export async function generateMealPlan(
  budget: number,
  ingredients: string,
  householdSize: string,
  primaryGoal: string
): Promise<MealPlanResponse> {
  if (process.env.USE_AI_MOCK === 'true') {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    return {
      mealPlan: [
        { day: 'Monday', breakfast: 'Akara and Pap', lunch: 'Jollof Rice', dinner: 'Eba and Egusi Soup' },
        { day: 'Tuesday', breakfast: 'Yam and Egg Sauce', lunch: 'Fried Rice', dinner: 'Amala and Ewedu' },
        { day: 'Wednesday', breakfast: 'Bread and Tea', lunch: 'Beans and Plantain', dinner: 'Pounded Yam and Edikaikong' },
        { day: 'Thursday', breakfast: 'Moi Moi and Pap', lunch: 'White Rice and Stew', dinner: 'Semo and Ogbono' },
        { day: 'Friday', breakfast: 'Oats and Milk', lunch: 'Spaghetti', dinner: 'Fufu and Bitterleaf Soup' },
        { day: 'Saturday', breakfast: 'Pancakes', lunch: 'Asaro (Yam Porridge)', dinner: 'Ewa Agoyin' },
        { day: 'Sunday', breakfast: 'Boiled Plantain and Stew', lunch: 'Sunday Jollof', dinner: 'Suya and Garri' }
      ],
      shoppingList: [
        { item: 'Rice', quantity: '1 Derica' },
        { item: 'Beans', quantity: '1 Derica' },
        { item: 'Yam', quantity: '1 Tuber' },
        { item: 'Eggs', quantity: '1 Crate' },
      ],
      estimatedCost: budget > 15000 ? 15000 : budget,
      budgetStatus: budget > 15000 ? 'WITHIN_BUDGET' : 'APPROACHING_BUDGET',
    };
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY is missing');
  }

  const prompt = `Generate a 7-day budget-aware Nigerian meal plan.
Household Size: ${householdSize}
Goal: ${primaryGoal}
Budget: NGN ${budget}
Available Ingredients: ${ingredients}`;

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { 
          role: 'system', 
          content: 'You are a meal planning AI for Nigerian households. Return JSON matching the strictly required output schema. No markdown, no explanations.' 
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    throw new Error('DeepSeek API request failed');
  }

  const rawJson = await response.json();
  const content = rawJson.choices[0].message.content;
  
  // Parse and safely return validated schema
  const parsed = JSON.parse(content);
  return DeepSeekResponseSchema.parse(parsed);
}

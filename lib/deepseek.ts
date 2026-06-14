import { z } from 'zod';
import fs from 'fs';
import path from 'path';

const MealSchema = z.object({
  mealName: z.string(),
  ingredients: z.array(z.string()),
  quantities: z.array(z.string()),
});

export const DeepSeekResponseSchema = z.object({
  budgetStrategy: z.string().optional(),
  ingredientUtilization: z.string(),
  mealPlan: z.array(
    z.object({
      day: z.string(),
      breakfast: MealSchema,
      lunch: MealSchema,
      dinner: MealSchema,
    })
  ).length(7),
});

export interface MealPlanResponse {
  budgetStrategy?: string;
  ingredientUtilization: string;
  mealPlan: {
    day: string;
    breakfast: string;
    lunch: string;
    dinner: string;
    primaryIngredientsUsed: string[];
  }[];
  shoppingList: { item: string; quantity: string }[];
  estimatedCost: number;
  budgetStatus: 'WITHIN_BUDGET' | 'APPROACHING_BUDGET' | 'EXCEEDS_BUDGET';
  estimatedCostRange?: { min: number; max: number };
  budgetUtilization?: number;
  _rawIngredients?: { item: string; quantity: string }[];
}

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
(CRITICAL INSTRUCTION: You MUST incorporate these specific available ingredients into your meals. Do not suggest buying new proteins like Chicken or Beef if the user already has proteins like Stockfish or Eggs.)

CRITICAL RULES FOR ALL GENERATIONS:
1. Day 1 (Monday) is the first day. You CANNOT have leftovers on Monday. NEVER use words like "leftover", "remaining", or "from previous" on Day 1.
2. If you suggest a leftover on Days 2-7, the EXACT original meal must have been cooked on an earlier day.
3. QUANTITY REALISM: Your shopping list must logically support the meals you generate for the household size.
4. SHOPPING LIST CONSISTENCY: Every primary ingredient mentioned in your meal plan MUST appear in your shopping list unless it was listed in the user's available pantry ingredients.
5. MEAL REALISM: Do not suggest meals that Nigerians do not eat (e.g., Garri + Palm Oil + Salt). Ensure combinations are practical and culturally accurate.
6. MEAL VARIETY: Ensure reasonable weekly variety. No exact meal should dominate the week. Rotate among Rice, Beans, Yam, Garri, Plantain, Pap, and local soups. Do not repeat the exact same meal more than 3 times in the entire week.
7. QUANTITY SCALING: You must scale your shopping list quantities strictly for a household size of ${householdSize}. Do NOT suggest bulk/family-size items (e.g., "3kg tomatoes", "2.5L palm oil", "1 crate of eggs") for a household of 1. Suggest small, affordable market measurements (e.g., "1 small paint rubber", "1 sachet", "₦200 worth", "2 pieces").
8. NO REASONING: DO NOT include internal thoughts, questions, or reasoning in the meal fields. The meal text must be clean and final.
9. BALANCED PANTRY OPTIMIZATION: Maximize pantry utilization without creating a repetitive or unrealistic weekly menu.
10. BREAKFAST VARIETY: Do not repeat the exact same breakfast more than TWICE per week.
11. PROTEIN ROTATION: Rotate between Eggs, Beans, Stockfish, Crayfish, Sardines, and Chicken (if budget allows). Avoid using the same protein repeatedly.
12. CARBOHYDRATE ROTATION: Rotate between Rice, Yam, Garri, Spaghetti, Amala, and Semo. Avoid excessive repetition.
13. LEFTOVER REUSE & FRESHNESS: Reuse leftovers only when it improves cost efficiency. A leftover MUST be eaten within 1 or 2 days of the original meal. NEVER suggest a leftover from 3 or more days ago (e.g., Wednesday meal eaten on Saturday).
14. NUTRITION BALANCE: Ensure every day includes a carbohydrate, a protein, and vegetables where possible.
15. COST-FIRST OPTIMIZATION: When using a well-stocked pantry, Cost Minimization becomes your HIGHEST priority. Avoid introducing premium ingredients when pantry alternatives exist. Every newly introduced ingredient must justify its cost impact.
16. PROTEIN PRIORITY HIERARCHY: You MUST prefer pantry proteins before introducing new proteins. Follow this exact priority order: 1. Stockfish -> 2. Crayfish -> 3. Beans -> 4. Eggs -> 5. Sardines -> 6. Chicken -> 7. Beef. Avoid Chicken and Beef unless required for nutritional balance or explicitly requested.
17. INGREDIENT REALISM: In the \`ingredients\` array, only list RAW market ingredients. Do NOT list "Leftover [Meal]" as an ingredient. Do NOT list "Pounded Yam" as an ingredient (list "Yam" or "Poundo Flour" instead).`;

  if (budgetFriendly) {
    let budgetContext = `You MUST enter VALUE-OPTIMIZATION MODE.`;
    if (originalEstimatedCost) {
      budgetContext = `Your previous standard recommendation cost NGN ${originalEstimatedCost}, but the user wants a BUDGET-FRIENDLY ALTERNATIVE. You MUST enter VALUE-OPTIMIZATION MODE to fit this budget.`;
    }
    
    prompt += `\n\nURGENT BUDGET OVERRIDE: ${budgetContext}
Optimization Strategy Rules:
1. MAXIMIZE AVAILABLE INGREDIENTS: Rely heavily on what the user already has in their pantry.
2. REDUCE SHOPPING LIST SIZE: Minimize the number of items that need to be purchased.
3. REMOVE UNNECESSARY INGREDIENTS: Strip out any ingredient that isn't strictly necessary for the core meal.
4. PREFER AFFORDABLE STAPLES: Lean towards cheap, locally available Nigerian staples (Garri, Beans, etc).
5. REDUCE EXPENSIVE PROTEINS: Avoid Beef, Chicken, and Turkey. Swap them for affordable proteins like Eggs, Crayfish, or Dried Fish.
6. PREFER INGREDIENT REUSE: If you must buy an ingredient, use it across multiple meals to get maximum value.
7. Target an 80%-90% budget utilization. Do not generate the cheapest possible plan; generate the BEST value plan within the limit.
8. YOU MUST INCLUDE a \`budgetStrategy\` field at the very top of your JSON. In it, explicitly declare which expensive items you avoided to stay within budget.
9. If the budget is extremely tight, it is completely acceptable to reduce meal variety. Repeating affordable staple meals is required if it keeps the estimatedCost below the limit.`;
  } else {
    prompt += `\n\nRECOMMENDED PLAN MODE:
You are NOT in Value-Optimization mode. Your goal is to generate the highest quality, most realistic Nigerian meal plan possible using the pantry as a base.
CRITICAL RULE: Aim for high meal quality and variety, but STILL respect the user's budget constraint as a firm limit. You can spend closer to 100% of the budget to maximize variety, but DO NOT exceed the user's budget. Variety is important, but Affordability and Pantry Utilization remain the top priorities.
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

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse DeepSeek JSON response:', content);
      throw new Error('AI returned malformed JSON');
    }

    let validatedData;
    try {
      validatedData = DeepSeekResponseSchema.parse(parsed);
    } catch (validationError) {
      console.error('Zod Validation Error on DeepSeek response:', validationError);
      throw new Error('AI response did not match the required schema');
    }

    const legacyMealPlan: MealPlanResponse["mealPlan"] = [];
    const rawIngredients: { item: string; quantity: string }[] = [];

    for (const day of validatedData.mealPlan) {
      const primaryIngredientsUsed: string[] = [];
      const meals = [day.breakfast, day.lunch, day.dinner];
      
      for (const meal of meals) {
        for (let i = 0; i < meal.ingredients.length; i++) {
          const ing = meal.ingredients[i];
          const qty = meal.quantities[i] || "";
          if (!primaryIngredientsUsed.includes(ing)) {
            primaryIngredientsUsed.push(ing);
          }
          rawIngredients.push({ item: ing, quantity: qty });
        }
      }

      legacyMealPlan.push({
        day: day.day,
        breakfast: day.breakfast.mealName,
        lunch: day.lunch.mealName,
        dinner: day.dinner.mealName,
        primaryIngredientsUsed
      });
    }

    return {
      budgetStrategy: validatedData.budgetStrategy,
      ingredientUtilization: validatedData.ingredientUtilization,
      mealPlan: legacyMealPlan,
      shoppingList: [],
      estimatedCost: 0,
      budgetStatus: 'WITHIN_BUDGET',
      _rawIngredients: rawIngredients
    };

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

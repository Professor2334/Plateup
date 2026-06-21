/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { sanitizeMealPlanResponse, normalizeTerminology, validateIngredients } from './ai-sanitizer';

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
  ),
  shoppingList: z.array(
    z.object({
      item: z.string(),
      quantity: z.string(),
    })
  ),
  estimatedCost: z.number(),
  budgetStatus: z.enum(['WITHIN_BUDGET', 'APPROACHING_BUDGET', 'EXCEEDS_BUDGET']),
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
  pantryContribution?: string;
  remainingBudget?: number;
}

// Read prompt files once at module load — not on every request.
// These are static config files that never change at runtime.
function loadPromptFiles(): string {
  const systemPromptPath = path.join(process.cwd(), '.agent/ai/system-prompt/SKILLS.md');
  const schemaPath = path.join(process.cwd(), '.agent/ai/output-schema/SKILLS.md');
  try {
    const systemPromptContent = fs.readFileSync(systemPromptPath, 'utf8');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    return `${systemPromptContent}\n\n${schemaContent}`;
  } catch (error) {
    console.error('Failed to read AI configuration files:', error);
    throw new Error('Internal Configuration Error: AI prompts missing.');
  }
}

const COMBINED_SYSTEM_MESSAGE = loadPromptFiles();

function getGoalSpecificRules(goal: string): string {
  const normalizedGoal = goal.toLowerCase();
  
  if (normalizedGoal.includes('save-time')) {
    return `PRIMARY GOAL RULES - SAVE TIME:
1. MINIMIZE COOKING FREQUENCY: Prioritize meals that require less active cooking time.
2. BATCH COOKING: Favor meals that can be cooked in large batches (e.g., Soups, Stews).
3. STRATEGIC LEFTOVERS: Increase the use of leftover meals. Cook once, eat twice.
4. REDUCE INGREDIENT VARIETY: Use similar base ingredients across meals to reduce prep time.
5. QUICK BREAKFASTS: Prefer extremely fast breakfasts (e.g., Bread and Tea, Pap and Akara (bought), Garri).`;
  }

  if (normalizedGoal.includes('reduce-food-waste')) {
    return `PRIMARY GOAL RULES - REDUCE FOOD WASTE:
1. CONSUME PANTRY FIRST: Prioritize using what the user already has.
2. PERISHABLES FIRST: Use fresh vegetables and perishable proteins early in the week.
3. REUSE VEGETABLES: If vegetables are bought, they MUST be used in multiple meals so they don't spoil.
4. NO SINGLE-USE INGREDIENTS: Every purchased ingredient must appear in at least one or more meals. Do not recommend an ingredient for just one small meal component.
5. MINIMIZE ORPHAN INGREDIENTS: Keep the shopping list highly cohesive and tightly matched to the meals.`;
  }

  if (normalizedGoal.includes('eat-healthier')) {
    return `PRIMARY GOAL RULES - EAT HEALTHIER:
1. INCREASE VEGETABLES: Ensure vegetables are included in as many meals as possible.
2. ADD FRUITS: Include fruit recommendations (e.g., Bananas, Oranges, Watermelon) if budget allows.
3. IMPROVE PROTEIN: Prioritize quality proteins (Beans, Fish, Chicken) over purely carb-heavy meals.
4. NUTRITIOUS BREAKFAST: Avoid purely empty carbs for breakfast; add proteins like eggs or beans.
5. DIVERSITY: Prefer balanced, diverse meals over the absolute cheapest options. Avoid excessive carbohydrate repetition.
6. FRESHNESS FIRST: Limit leftovers to a maximum of 1 or 2 per week. Prioritize freshly cooked, nutrient-rich meals over reusing leftovers.`;
  }

  // Default to save-money
  return `PRIMARY GOAL RULES - SAVE MONEY:
1. MAXIMIZE PANTRY: Rely heavily on existing ingredients.
2. MINIMIZE SHOPPING: Do not spend money just because budget exists. Remaining budget is considered a success.
3. REUSE INGREDIENTS: Use purchased ingredients across multiple meals.
4. AFFORDABLE STAPLES: Prefer cheap Nigerian staples (Garri, Beans, Rice).
5. REDUCE EXPENSIVE PROTEINS: Strictly avoid premium proteins unless the user already owns them. Use Eggs, Sardines, or Crayfish instead.`;
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

  // Calculate dynamic budget pressure based on household size
  const getHouseholdMultiplier = (size: string) => {
    if (size.includes('-')) return parseInt(size.split('-')[0], 10);
    if (size.includes('+')) return parseInt(size.replace('+', ''), 10);
    return parseInt(size, 10) || 1;
  };
  const householdMultiplier = getHouseholdMultiplier(householdSize);
  const totalWeeklyPortions = 21 * householdMultiplier; // 3 meals * 7 days * people
  const budgetPerPortion = budget / totalWeeklyPortions;
  const isBudgetTight = budgetPerPortion < 800; // Under 800 NGN per meal per person is tight

  let prompt = `Generate a 7-day budget-aware Nigerian meal plan.
Household Size: ${householdSize}
Goal: ${primaryGoal}
Budget: NGN ${budget}
Available Ingredients: ${ingredients}
(CRITICAL INSTRUCTION: You MUST incorporate these specific available ingredients into your meals. Do not suggest buying new proteins like Chicken or Beef if the user already has proteins like Stockfish or Eggs.)

${getGoalSpecificRules(primaryGoal)}

CRITICAL RULES FOR ALL GENERATIONS:
1. Day 1 (Monday) is the first day. You CANNOT have leftovers on Monday. NEVER use words like "leftover", "remaining", or "from previous" on Day 1.
2. If you suggest a leftover on Days 2-7, the EXACT original meal must have been cooked on an earlier day.
3. QUANTITY REALISM: Your shopping list must logically support the meals you generate for the household size.
4. ABSOLUTE SHOPPING LIST CONSISTENCY: Every single ingredient explicitly referenced in a generated meal MUST be available through either: 1) The user's pantry, OR 2) The generated shopping list. If a meal mentions "Egusi Soup with Stockfish", and Stockfish is not in the pantry, it MUST appear in the shopping list. Otherwise, change the meal to use an available protein. The final meal plan must be fully executable using ONLY the Pantry + Shopping List.
5. MEAL REALISM: Do not suggest meals that Nigerians do not eat (e.g., Garri + Palm Oil + Salt). Ensure combinations are practical and culturally accurate.
6. MEAL VARIETY: Ensure reasonable weekly variety. No exact meal should dominate the week. Rotate among Rice, Beans, Yam, Garri, Plantain, Pap, and local soups. Do not repeat the exact same meal more than 3 times in the entire week.
7. QUANTITY SCALING: You must scale your shopping list quantities strictly for a household size of ${householdSize}. Do NOT suggest bulk/family-size items (e.g., "3kg tomatoes", "2.5L palm oil", "1 crate of eggs") for a household of 1. Suggest small, affordable market measurements (e.g., "1 small paint rubber", "1 sachet", "₦200 worth", "2 pieces").
8. NO REASONING: DO NOT include internal thoughts, questions, or reasoning in the meal fields. The meal text must be clean and final.
9. NATURAL MEAL NAMES: DO NOT just append raw ingredients to the end of a meal name to prove you used them. Ingredients like palm oil, salt, and seasoning are cooked INTO the meal. Name the meal naturally. DO NOT include reasoning, suggestions, or words like "use", "instead", "maybe", or "consider" inside the meal names.
10. NIGERIAN TERMINOLOGY RULES (CRITICAL):
    - If Garri is paired with ANY soup (e.g., Okra, Egusi, Vegetable, Ogbono), you MUST output it as "Eba with [Soup Name]". NEVER output "Garri with Okra Soup" or "Garri with Soup".
    - Use "Garri" ONLY when it is consumed directly without hot water (e.g., "Soaked Garri with Groundnut", "Garri and Sugar").
11. REALISTIC PORTION MATH: When scaling quantities for the shopping list, be exact and realistic. For example, for a household of 1, eating eggs 3 times in a week means they need 3 to 6 eggs (1-2 per meal). Write quantities clearly (e.g., "6 pieces" or "half crate"). Do not suggest over-buying perishable proteins for a household of 1.
11. PANTRY-FIRST STRATEGY: Prioritize existing pantry ingredients before introducing new ones. The more ingredients the user has in their pantry, the more aggressively you MUST reuse them across the week.
12. PANTRY SCALING EXPECTATIONS: 
    - Minimal Pantry: Produce a larger shopping list, higher estimated spend, and lower savings.
    - Medium Pantry: Produce a noticeably smaller shopping list, lower estimated spend, and higher savings.
    - Heavy Pantry: Produce the SMALLEST shopping list, LOWEST estimated spend, and HIGHEST savings. A heavy pantry should drastically reduce shopping costs.
13. COMPLEMENTARY INGREDIENT CONTROL: Only introduce complementary ingredients when necessary to create balanced meals. Avoid unnecessary additions that increase costs. Favor affordable additions over expensive proteins.
14. BREAKFAST VARIETY: Do not repeat the exact same breakfast more than TWICE per week.
15. PROTEIN ROTATION: Rotate between Eggs, Beans, Stockfish, Crayfish, Sardines, and Chicken (if budget allows). Avoid using the same protein repeatedly.
16. CARBOHYDRATE ROTATION: Rotate between Rice, Yam, Garri, Spaghetti, Amala, and Semo. Avoid excessive repetition.
17. LEFTOVER REUSE & FRESHNESS: Reuse leftovers only when it improves cost efficiency. A leftover MUST be eaten the VERY NEXT DAY (e.g. Wednesday dinner can be eaten Thursday lunch). NEVER suggest a leftover that spans 2 or more days.
18. NUTRITION BALANCE: Ensure every day includes a carbohydrate, a protein, and vegetables where possible.
19. COST-FIRST OPTIMIZATION: When using a well-stocked pantry, Cost Minimization becomes your HIGHEST priority. Avoid introducing premium ingredients when pantry alternatives exist. Every newly introduced ingredient must justify its cost impact.
20. PROTEIN PRIORITY HIERARCHY: You MUST prefer pantry proteins before introducing new proteins. Follow this exact priority order: 1. Stockfish -> 2. Crayfish -> 3. Beans -> 4. Eggs -> 5. Sardines -> 6. Chicken -> 7. Beef. Avoid Chicken and Beef unless required for nutritional balance or explicitly requested.
21. STRICT PROTEIN BUDGET RULE: ${isBudgetTight ? "The budget per portion is TIGHT. NEVER add Chicken, Beef, or Goat Meat to the shopping list. You must rely exclusively on affordable proteins like Eggs, Fish, Sardines, Crayfish, and Beans." : "The budget per portion allows for standard proteins, but you MUST still minimize costs and avoid unnecessary luxury items."} The AI must be highly stable and consistent in cost estimation. Do not artificially inflate the shopping list just because there is "remaining budget". Your goal is to save the user money.
22. PANTRY-AWARE BUDGET UTILIZATION INTELLIGENCE:
    - Target Budget Utilization based on budget size:
      * Budget below ₦25,000: Target 80%-95% utilization.
      * Budget ₦25,000 - ₦40,000: Target 70%-90% utilization.
      * Budget above ₦40,000: Target 60%-85% utilization.
    - PANTRY OWNERSHIP RESPECT: If the user owns substantial pantry ingredients, DO NOT force spending just to hit these utilization targets. Avoid recommending duplicate purchases.
    - ENRICHMENT RULES: If utilization falls below the target range, enrich the plan naturally without wasting money:
      * Level 1 (Highest): Add Vegetables, Fruits, Protein sources, and nutritious breakfast options.
      * Level 2: Increase meal variety, better portion sizes, additional side dishes.
      * Level 3: Convenience foods only if justified.
    - NEVER add ingredients solely to spend budget. Every addition must improve Nutrition, Variety, Portion adequacy, Family feeding capacity, or User goal satisfaction.

PANTRY COST OPTIMIZATION RULES:
1. Treat pantry ingredients as ingredients the user already owns and has already paid for.
2. Pantry ingredients must contribute ZERO additional cost to the shopping list.
3. Prioritize meals that maximize pantry ingredient usage before introducing new ingredients.
4. The larger the pantry, the fewer ingredients should appear in the shopping list.
5. Heavy pantry scenarios must produce:
   - Smaller shopping lists
   - Lower estimated spending
   - Higher savings
   than medium pantry scenarios.
6. Medium pantry scenarios must produce:
   - Smaller shopping lists
   - Lower estimated spending
   - Higher savings
   than minimal pantry scenarios.
7. Estimate spending using ONLY ingredients that appear in the final shopping list.
8. Savings should increase as pantry utilization increases.
9. Before returning a response, validate that:
   - Heavy pantry spending is not higher than medium pantry spending.
   - Heavy pantry savings are not lower than medium pantry savings.
   - Heavy pantry shopping lists are not larger than medium pantry shopping lists.
   - EVERY SINGLE INGREDIENT placed in \`primaryIngredientsUsed\` originates strictly from the Pantry or the Shopping List. If not, the system will reject your response.
10. If the generated result violates these rules, regenerate the meal plan and shopping list before returning the final response.`;

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
7. TARGET MAXIMUM SAVINGS: Your goal is to produce the most affordable plan possible using the pantry. If the user has a heavily stocked pantry, your budget utilization should naturally be extremely low. Do not artificially inflate costs to hit any budget percentage.
8. YOU MUST INCLUDE a \`budgetStrategy\` field at the very top of your JSON. In it, explicitly declare which expensive items you avoided to stay within budget.
9. If the budget is extremely tight, it is completely acceptable to reduce meal variety. Repeating affordable staple meals is required if it keeps the estimatedCost below the limit.`;
  } else {
    prompt += `\n\nRECOMMENDED PLAN MODE:
You are NOT in Value-Optimization mode. Your goal is to generate the highest quality, most realistic Nigerian meal plan possible using the pantry as a base.
CRITICAL RULE: While you should aim for high meal quality and variety, DO NOT artificially inflate the shopping list just to reach the budget limit. If the user has a heavily stocked pantry, your estimated spending should naturally be very low, resulting in high savings. Only buy what is strictly necessary to complete the meals. Respect the Pantry Cost Optimization Rules above.
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
          { role: 'system', content: COMBINED_SYSTEM_MESSAGE },
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

    const validationResult = DeepSeekResponseSchema.safeParse(parsed);
    const validatedData = sanitizeMealPlanResponse<z.infer<typeof DeepSeekResponseSchema>>(validationResult);

    const legacyMealPlan: MealPlanResponse["mealPlan"] = [];

    for (const day of validatedData.mealPlan) {
      legacyMealPlan.push({
        day: day.day,
        breakfast: day.breakfast,
        lunch: day.lunch,
        dinner: day.dinner,
        primaryIngredientsUsed: day.primaryIngredientsUsed || []
      });
    }

    // 1. Normalize Terminology (Garri -> Eba logic)
    const normalizedMealPlan = legacyMealPlan.map(day => ({
      ...day,
      breakfast: normalizeTerminology(day.breakfast),
      lunch: normalizeTerminology(day.lunch),
      dinner: normalizeTerminology(day.dinner),
    }));

    // 2. Strict Ingredient Validation
    validateIngredients(ingredients, validatedData.shoppingList, normalizedMealPlan);

    return {
      budgetStrategy: validatedData.budgetStrategy,
      ingredientUtilization: validatedData.ingredientUtilization,
      mealPlan: normalizedMealPlan,
      shoppingList: validatedData.shoppingList,
      estimatedCost: validatedData.estimatedCost,
      budgetStatus: validatedData.budgetStatus
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

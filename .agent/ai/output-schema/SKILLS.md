# OUTPUT_SCHEMA.md

All PlateUp AI responses must strictly follow this structure.

```json
{
  "budgetStrategy": "Optional string explaining cost optimization...",
  "ingredientUtilization": "Used 100% of user ingredients (Rice, Bread). Added eggs and tomatoes to complete meals.",
  "mealPlan": [
    {
      "day": "Monday",
      "breakfast": "Yam and Egg Sauce",
      "lunch": "White Rice and Stew",
      "dinner": "Beans Porridge"
    },
    {
      "day": "Tuesday",
      "breakfast": "...",
      "lunch": "...",
      "dinner": "..."
    }
  ],
  "shoppingList": [
    {
      "item": "Tomatoes",
      "quantity": "₦500 worth"
    },
    {
      "item": "Eggs",
      "quantity": "4 pieces"
    }
  ],
  "estimatedCost": 1200,
  "budgetStatus": "WITHIN_BUDGET"
}
```

---

# Field Definitions

## budgetStrategy
(Optional) Explicit declaration of which expensive items were avoided to stay within budget during Value-Optimization mode.
Type: `string`

## ingredientUtilization
A brief explanation of how you utilized the user's available ingredients. If you added new ingredients, briefly justify why.
Type: `string`

## mealPlan
Seven-day meal plan. Each day must contain `day`, `breakfast`, `lunch`, and `dinner` (all strings).

## shoppingList
Array of objects containing `item` (string) and `quantity` (string) for all ingredients the user MUST purchase. Ensure quantities strictly match the requested household size using practical Nigerian market measurements.

## estimatedCost
The total realistic estimated cost (in NGN) of ONLY the items on the shopping list. Do not include the value of items the user already owns.
Type: `number`

## budgetStatus
Must be exactly one of: `"WITHIN_BUDGET"`, `"APPROACHING_BUDGET"`, or `"EXCEEDS_BUDGET"`.
Type: `string`

---

# Validation Rules

The response is invalid if:
- ingredientUtilization, mealPlan, shoppingList, estimatedCost, or budgetStatus are missing.
- Any day or meal is missing.
- Any shopping list item is missing an item or quantity.
- estimatedCost is not a number.

---

# Response Rules

Return JSON only. Do not return Markdown, Explanations, Notes, or Commentary.
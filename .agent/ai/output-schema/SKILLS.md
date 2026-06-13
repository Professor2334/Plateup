# OUTPUT_SCHEMA.md

All PlateUp AI responses must strictly follow this structure.

```json
{
  "ingredientUtilization": "Used 100% of user ingredients (Rice, Bread). Added eggs and tomatoes to complete meals.",
  "mealPlan": [
    {
      "day": "Monday",
      "breakfast": "",
      "lunch": "",
      "dinner": "",
      "primaryIngredientsUsed": ["", ""]
    },
    {
      "day": "Tuesday",
      "breakfast": "",
      "lunch": "",
      "dinner": "",
      "primaryIngredientsUsed": ["", ""]
    },
    {
      "day": "Wednesday",
      "breakfast": "",
      "lunch": "",
      "dinner": "",
      "primaryIngredientsUsed": ["", ""]
    },
    {
      "day": "Thursday",
      "breakfast": "",
      "lunch": "",
      "dinner": "",
      "primaryIngredientsUsed": ["", ""]
    },
    {
      "day": "Friday",
      "breakfast": "",
      "lunch": "",
      "dinner": "",
      "primaryIngredientsUsed": ["", ""]
    },
    {
      "day": "Saturday",
      "breakfast": "",
      "lunch": "",
      "dinner": "",
      "primaryIngredientsUsed": ["", ""]
    },
    {
      "day": "Sunday",
      "breakfast": "",
      "lunch": "",
      "dinner": "",
      "primaryIngredientsUsed": ["", ""]
    }
  ],
  "shoppingListCalculations": "Bread is used 4 times for breakfast. Household size is 4. 4 meals * 4 people = 16 slices required. Therefore, 1 large loaf is needed.",
  "shoppingList": [
    {
      "item": "",
      "quantity": ""
    }
  ],
  "estimatedCost": 0,
  "budgetStatus": "WITHIN_BUDGET"
}
```

---

# Field Definitions

## ingredientUtilization

A brief explanation of how you utilized the user's available ingredients. If you added new ingredients, briefly justify why.

Type:
```json
string
```

---

## mealPlan

Seven-day meal plan.

Required:

- Monday
- Tuesday
- Wednesday
- Thursday
- Friday
- Saturday
- Sunday

Each day must contain:

- Breakfast
- Lunch
- Dinner
- primaryIngredientsUsed (An array of the main ingredients required for that day's meals)

---

## shoppingListCalculations

A mandatory chain-of-thought calculation block before outputting the shopping list.
You must:
1. Scan your generated 7-day meal plan.
2. Calculate the frequency of every non-pantry ingredient used.
3. Multiply by Household Size to determine the total required quantity.

Type:
```json
string
```

---

## shoppingList

Combined ingredient list required to prepare the meal plan.

Each item should contain:

```json
{
  "item": "",
  "quantity": ""
}
```

---

## estimatedCost

Estimated total weekly cost.

Type:

```json
number
```

Example:

```json
25000
```

---

## budgetStatus

Allowed values only:

```text
WITHIN_BUDGET
APPROACHING_BUDGET
EXCEEDS_BUDGET
```

No other values are permitted.

---

# Validation Rules

The response is invalid if:

- ingredientUtilization is missing
- mealPlan is missing
- primaryIngredientsUsed is missing from any meal day
- shoppingList is missing
- estimatedCost is missing
- budgetStatus is missing
- Any day is missing
- Any meal is missing
- Invalid budget status is returned

---

# Response Rules

Return JSON only.

Do not return:

- Markdown
- Explanations
- Notes
- Commentary
- Additional fields

The output must match this schema exactly.
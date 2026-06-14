# OUTPUT_SCHEMA.md

All PlateUp AI responses must strictly follow this structure.

```json
{
  "ingredientUtilization": "Used 100% of user ingredients (Rice, Bread). Added eggs and tomatoes to complete meals.",
  "mealPlan": [
    {
      "day": "Monday",
      "breakfast": {
        "mealName": "Yam and Egg Sauce",
        "ingredients": ["Yam", "Eggs", "Tomatoes", "Pepper", "Onions", "Vegetable Oil"],
        "quantities": ["500g", "4 pieces", "2 medium", "1 tablespoon", "1 medium", "2 tablespoons"]
      },
      "lunch": {
        "mealName": "White Rice and Stew",
        "ingredients": ["Rice", "Tomatoes", "Pepper", "Onions", "Chicken"],
        "quantities": ["2 cups", "4 medium", "2 tablespoons", "1 medium", "2 pieces"]
      },
      "dinner": {
        "mealName": "Beans Porridge",
        "ingredients": ["Beans", "Palm Oil", "Onions", "Pepper", "Crayfish"],
        "quantities": ["1.5 cups", "3 tablespoons", "1 medium", "1 tablespoon", "1 tablespoon"]
      }
    },
    {
      "day": "Tuesday",
      "breakfast": {
        "mealName": "...",
        "ingredients": ["..."],
        "quantities": ["..."]
      },
      "lunch": {
        "mealName": "...",
        "ingredients": ["..."],
        "quantities": ["..."]
      },
      "dinner": {
        "mealName": "...",
        "ingredients": ["..."],
        "quantities": ["..."]
      }
    }
    // ... continue for Wednesday, Thursday, Friday, Saturday, Sunday
  ]
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

Each meal (breakfast, lunch, dinner) must be an object containing:
- mealName: The name of the meal being prepared. (string)
- ingredients: An array of strings listing ALL ingredients required to make this meal. (string[])
- quantities: An array of strings listing the exact quantity of each corresponding ingredient required to feed the specific household size. (string[])

Note: The `ingredients` array and `quantities` array must have the exact same length.

---

# Validation Rules

The response is invalid if:

- ingredientUtilization is missing
- mealPlan is missing
- Any day is missing
- Any meal (breakfast, lunch, dinner) is missing
- Any meal is missing mealName, ingredients, or quantities
- The ingredients and quantities arrays for a meal do not have the same number of elements

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
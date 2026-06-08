# OUTPUT_SCHEMA.md

All PlateUp AI responses must strictly follow this structure.

```json
{
  "mealPlan": [
    {
      "day": "Monday",
      "breakfast": "",
      "lunch": "",
      "dinner": ""
    },
    {
      "day": "Tuesday",
      "breakfast": "",
      "lunch": "",
      "dinner": ""
    },
    {
      "day": "Wednesday",
      "breakfast": "",
      "lunch": "",
      "dinner": ""
    },
    {
      "day": "Thursday",
      "breakfast": "",
      "lunch": "",
      "dinner": ""
    },
    {
      "day": "Friday",
      "breakfast": "",
      "lunch": "",
      "dinner": ""
    },
    {
      "day": "Saturday",
      "breakfast": "",
      "lunch": "",
      "dinner": ""
    },
    {
      "day": "Sunday",
      "breakfast": "",
      "lunch": "",
      "dinner": ""
    }
  ],
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

- mealPlan is missing
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
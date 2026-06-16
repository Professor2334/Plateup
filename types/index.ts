export interface GeneratedMeal {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  primaryIngredientsUsed?: string[];
}

export interface ShoppingItem {
  item: string;
  quantity: string;
}

export interface EstimatedCostRange {
  min: number;
  max: number;
}

export interface MealPlanModel {
  id: string;
  userId: string;
  budget: number;
  ingredients: string;
  // JSON fields are stored as unknown to remain compatible with Prisma's JsonValue.
  // Cast to GeneratedMeal[] / ShoppingItem[] at the point of consumption.
  generatedPlan: unknown;
  shoppingList: unknown;
  isSaved: boolean;
  createdAt: Date | string;
  updatedAt?: Date | string;

  // Optional fields injected after AI generation — not persisted in DB
  estimatedCost?: number;
  estimatedCostRange?: EstimatedCostRange;
  budgetUtilization?: number;
  budgetStatus?: 'WITHIN_BUDGET' | 'APPROACHING_BUDGET' | 'EXCEEDS_BUDGET';
}

// Typed helpers to safely cast JSON fields
export const getGeneratedMeals = (plan: MealPlanModel): GeneratedMeal[] =>
  plan.generatedPlan as GeneratedMeal[];

export const getShoppingList = (plan: MealPlanModel): ShoppingItem[] =>
  plan.shoppingList as ShoppingItem[];

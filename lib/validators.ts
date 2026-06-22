import { z } from 'zod';

export const SignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain a special character'),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const MEAL_PLANNING_GOALS = ['save-money', 'eat-healthy', 'reduce-food-waste', 'save-time'] as const;
export type MealPlanningGoal = typeof MEAL_PLANNING_GOALS[number];

export const MEAL_FREQUENCY_VALUES = ['2_meals', '3_meals'] as const;
export type MealFrequency = typeof MEAL_FREQUENCY_VALUES[number];

export const OnboardingSchema = z.object({
  householdSize: z.enum(['1', '2', '3-4', '5+'], {
    message: 'Please select a valid household size',
  }),
  // Goals are sent as a JSON-stringified array from FormData and pre-parsed before validation
  primaryGoals: z.array(
    z.enum(MEAL_PLANNING_GOALS, { message: 'Invalid goal selected' })
  ).min(1, 'Please select at least one goal').max(2, 'You can select up to 2 goals'),
  mealFrequency: z.enum(MEAL_FREQUENCY_VALUES).default('3_meals'),
});

export const MealPlanGenerationSchema = z.object({
  budget: z.number().min(1000, 'Minimum budget is NGN 1000'),
  ingredients: z.string().min(2, 'Please list some ingredients'),
});

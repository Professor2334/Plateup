import { z } from 'zod';

export const SignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const OnboardingSchema = z.object({
  householdSize: z.enum(['1', '2', '3-4', '5+'], {
    message: 'Please select a valid household size',
  }),
  primaryGoal: z.enum(['save-money', 'save-time', 'reduce-waste', 'eat-healthier'], {
    message: 'Please select a primary goal',
  }),
});

export const MealPlanGenerationSchema = z.object({
  budget: z.number().min(1000, 'Minimum budget is NGN 1000'),
  ingredients: z.string().min(2, 'Please list some ingredients'),
});

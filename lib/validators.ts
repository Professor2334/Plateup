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

/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { auth, unstable_update } from '@/lib/auth';
import db from '@/lib/db';
import { OnboardingSchema } from '@/lib/validators';
import { revalidatePath } from 'next/cache';

export async function completeOnboarding(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const householdSize = formData.get('householdSize') as string;
  const mealFrequency = formData.get('mealFrequency') as string;

  // Goals are sent as a JSON-stringified array (FormData can't natively carry arrays)
  let parsedGoals: unknown;
  try {
    parsedGoals = JSON.parse(formData.get('primaryGoals') as string);
  } catch {
    return { success: false, error: 'Invalid goals format.' };
  }

  const validatedFields = OnboardingSchema.safeParse({
    householdSize,
    primaryGoals: parsedGoals,
    mealFrequency: mealFrequency || '3_meals',
  });

  if (!validatedFields.success) {
    return { success: false, error: 'Invalid onboarding data provided.' };
  }

  const { householdSize: validHouseholdSize, primaryGoals, mealFrequency: validMealFrequency } = validatedFields.data;

  try {
    // Execute both the database update and the session cookie update concurrently for maximum speed
    await Promise.all([
      db.user.update({
        where: { id: session.user.id },
        data: {
          householdSize: validHouseholdSize,
          primaryGoal: primaryGoals,
          mealFrequency: validMealFrequency,
          onboardingCompleted: true,
        },
      }),
      unstable_update({ user: { onboardingCompleted: true } } as any)
    ]);

    // Revalidate dashboard to reflect completed onboarding
    revalidatePath('/dashboard');
  } catch (error) {
    console.error('Onboarding Error:', error);
    return { success: false, error: 'Failed to complete onboarding.' };
  }

  return { success: true };
}

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

  const data = Object.fromEntries(formData.entries());
  const validatedFields = OnboardingSchema.safeParse(data);

  if (!validatedFields.success) {
    return { success: false, error: 'Invalid onboarding data provided.' };
  }

  const { householdSize, primaryGoal } = validatedFields.data;

  try {
    await db.user.update({
      where: { id: session.user.id },
      data: {
        householdSize,
        primaryGoal,
        onboardingCompleted: true,
      },
    });

    // Update the session cookie so middleware knows onboarding is done
    await unstable_update({ user: { onboardingCompleted: true } } as any);

    // Revalidate dashboard to reflect completed onboarding
    revalidatePath('/dashboard');
  } catch (error) {
    console.error('Onboarding Error:', error);
    return { success: false, error: 'Failed to complete onboarding.' };
  }

  return { success: true };
}

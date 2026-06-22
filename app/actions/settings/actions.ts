'use server';

import db from '@/lib/db';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export async function updatePreferences(householdSize: string, primaryGoal: string[], receiveWeeklyReminders?: boolean, receiveProductUpdates?: boolean, mealFrequency?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await db.user.update({
      where: { id: session.user.id },
      data: {
        householdSize,
        primaryGoal,
        ...(receiveWeeklyReminders !== undefined && { receiveWeeklyReminders }),
        ...(receiveProductUpdates !== undefined && { receiveProductUpdates }),
        ...(mealFrequency !== undefined && { mealFrequency }),
      }
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Update preferences error:', error);
    return { success: false, error: 'Failed to update preferences' };
  }
}

export async function updateProfile(name: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  if (!name || name.trim().length < 2) {
    return { success: false, error: 'Name must be at least 2 characters long' };
  }

  try {
    await db.user.update({
      where: { id: session.user.id },
      data: { name: name.trim() }
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

export async function changePassword(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;

  if (!currentPassword || !newPassword) {
    return { success: false, error: 'Missing required fields' };
  }

  try {
    // Only select the fields we need — avoids fetching unused columns including name, email, etc.
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, password: true },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (!user.password) {
      return { success: false, error: 'Cannot change password for users authenticated via Google.' };
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return { success: false, error: 'Current password is incorrect' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    return { success: true };
  } catch (error) {
    console.error('Change password error:', error);
    return { success: false, error: 'Failed to change password' };
  }
}

export async function deleteAccount() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const userId = session.user.id;
    const userEmail = session.user.email;

    // Use a transaction to ensure all associated records are deleted atomically.
    // Order matters depending on foreign keys, but Prisma handles it if we delete dependents first.
    await db.$transaction([
      db.mealPlan.deleteMany({ where: { userId } }),
      db.verificationToken.deleteMany({ where: { userId } }),
      db.passwordResetToken.deleteMany({ where: { email: userEmail! } }), // email might be null for OAuth but we require email
      // Delete the actual user record
      db.user.delete({ where: { id: userId } }),
    ]);

    return { success: true };
  } catch (error) {
    console.error('Delete account error:', error);
    return { success: false, error: 'Failed to delete account' };
  }
}


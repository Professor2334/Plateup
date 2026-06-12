'use server';

import db from '@/lib/db';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { sendPasswordResetEmail } from '@/lib/resend';
import { z } from 'zod';

const requestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const resetSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export async function requestPasswordReset(formData: FormData) {
  try {
    const rawEmail = formData.get('email');
    const validatedData = requestSchema.safeParse({ email: rawEmail });
    
    if (!validatedData.success) {
      return { success: false, error: validatedData.error.errors[0].message };
    }

    const email = validatedData.data.email.toLowerCase();

    // Check if user exists (but don't reveal it to the client)
    const user = await db.user.findUnique({
      where: { email }
    });

    // We proceed to simulate work even if the user is not found, to prevent email enumeration.
    if (user) {
      // 1. Delete any existing reset tokens for this user
      await db.passwordResetToken.deleteMany({
        where: { email }
      });

      // 2. Generate new token
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

      // 3. Save to database
      await db.passwordResetToken.create({
        data: {
          email,
          token,
          expires
        }
      });

      // 4. Send email
      await sendPasswordResetEmail(email, token);
    }

    // Always return success
    return { success: true };
  } catch (error) {
    console.error('Request password reset error:', error);
    return { success: false, error: 'Failed to process request. Please try again later.' };
  }
}

export async function resetPassword(formData: FormData) {
  try {
    const token = formData.get('token');
    const password = formData.get('password');

    const validatedData = resetSchema.safeParse({ token, password });

    if (!validatedData.success) {
      return { success: false, error: validatedData.error.errors[0].message };
    }

    const { token: validToken, password: validPassword } = validatedData.data;

    // 1. Find token
    const resetTokenRecord = await db.passwordResetToken.findUnique({
      where: { token: validToken }
    });

    if (!resetTokenRecord) {
      return { success: false, error: 'Invalid or expired password reset link.' };
    }

    // 2. Check expiration
    if (new Date() > resetTokenRecord.expires) {
      await db.passwordResetToken.delete({ where: { id: resetTokenRecord.id } });
      return { success: false, error: 'Password reset link has expired.' };
    }

    // 3. Find user
    const user = await db.user.findUnique({
      where: { email: resetTokenRecord.email }
    });

    if (!user) {
      return { success: false, error: 'User associated with this token no longer exists.' };
    }

    // 4. Update user password
    const hashedPassword = await bcrypt.hash(validPassword, 10);
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    // 5. Delete the token
    await db.passwordResetToken.delete({
      where: { id: resetTokenRecord.id }
    });

    return { success: true };
  } catch (error) {
    console.error('Reset password error:', error);
    return { success: false, error: 'Failed to reset password. Please try again later.' };
  }
}

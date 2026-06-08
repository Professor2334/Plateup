'use server';

import bcrypt from 'bcrypt';
import db from '@/lib/db';
import { SignupSchema } from '@/lib/validators';
import { sendVerificationEmail } from '@/lib/resend';
import { randomBytes } from 'crypto';
import { signOut } from '@/lib/auth';

export async function registerUser(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const validatedFields = SignupSchema.safeParse(data);

  if (!validatedFields.success) {
    return { success: false, error: 'Invalid fields' };
  }

  const { email, password, name } = validatedFields.data;

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: 'Email already in use' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Create verification token
    const token = randomBytes(32).toString('hex');
    await db.verificationToken.create({
      data: {
        userId: user.id,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      },
    });

    // Send email
    await sendVerificationEmail(email, token);

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Something went wrong' };
  }
}

export async function verifyEmailToken(token: string) {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verificationToken) {
      return { success: false, error: 'Invalid token' };
    }

    if (verificationToken.expires < new Date()) {
      return { success: false, error: 'Token expired' };
    }

    await db.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: true },
    });

    await db.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return { success: true };
  } catch (error) {
    console.error('Verification error:', error);
    return { success: false, error: 'Something went wrong' };
  }
}

export async function logoutUser() {
  await signOut({ redirectTo: '/auth/login' });
}

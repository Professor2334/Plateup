'use server';

import bcrypt from 'bcrypt';
import db from '@/lib/db';
import { SignupSchema } from '@/lib/validators';
import { sendVerificationEmail } from '@/lib/resend';
import { randomBytes } from 'crypto';
import { signOut } from '@/lib/auth';
import { headers } from 'next/headers';
import { authRateLimit } from '@/lib/rate-limit';

export async function registerUser(formData: FormData) {
  const ip = headers().get('x-forwarded-for') ?? '127.0.0.1';
  const { success: limitSuccess } = await authRateLimit.limit(ip);
  if (!limitSuccess) {
    return { success: false, error: 'Too many requests. Please try again later.' };
  }

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

    // Create verification token — 24h window gives the user time to verify after onboarding
    const token = randomBytes(32).toString('hex');
    await db.verificationToken.create({
      data: {
        userId: user.id,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      },
    });

    // Send email immediately, but don't block the user from proceeding
    await sendVerificationEmail(email, token);

    // Return the plain password so the client can auto-sign-in without re-entry
    return { success: true, email, password };
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
      data: { emailVerified: new Date() },
    });

    await db.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return { success: true, email: verificationToken.user.email };
  } catch (error) {
    console.error('Verification error:', error);
    return { success: false, error: 'Something went wrong' };
  }
}

export async function logoutUser() {
  await signOut({ redirectTo: '/auth/login' });
}

export async function resendVerificationEmailAction(email: string) {
  const ip = headers().get('x-forwarded-for') ?? '127.0.0.1';
  const { success: limitSuccess } = await authRateLimit.limit(ip);
  if (!limitSuccess) {
    return { success: false, error: 'Too many requests. Please try again later.' };
  }

  try {
    const user = await db.user.findUnique({
      where: { email }
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (user.emailVerified !== null) {
      return { success: false, error: 'Email already verified' };
    }

    // Delete existing token if any
    await db.verificationToken.deleteMany({
      where: { userId: user.id }
    });

    const token = randomBytes(32).toString('hex');
    await db.verificationToken.create({
      data: {
        userId: user.id,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      },
    });

    await sendVerificationEmail(email, token);

    return { success: true };
  } catch (error) {
    console.error('Resend verification error:', error);
    return { success: false, error: 'Something went wrong' };
  }
}

export async function checkLoginRateLimit(email: string) {
  const ip = headers().get('x-forwarded-for') ?? '127.0.0.1';
  // Use both IP and email to prevent locking out other accounts on the same network
  const identifier = `${ip}_${email.toLowerCase()}`;
  const { success: limitSuccess, reset } = await authRateLimit.limit(identifier);
  
  if (!limitSuccess) {
    const minutesLeft = Math.max(1, Math.ceil((reset - Date.now()) / 60000));
    return { success: false, error: `Too many attempts. Try again in ${minutesLeft} minute${minutesLeft === 1 ? '' : 's'}` };
  }
  return { success: true };
}

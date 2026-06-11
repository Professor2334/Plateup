'use server';

import db from '@/lib/db';
import { sendContactNotification, sendContactConfirmation } from '@/lib/resend';
import { auth } from '@/lib/auth';

export async function submitContactMessage(formData: FormData) {
  try {
    const session = await auth();
    // If logged in, get email from session, else from form data
    const email = session?.user?.email || (formData.get('email') as string);
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const name = session?.user?.name || null;

    if (!email || !subject || !message) {
      return { success: false, error: 'All fields are required.' };
    }

    // 1. Save to DB
    await db.contactMessage.create({
      data: {
        email,
        subject,
        message,
      },
    });

    // 2. Send notification to support
    await sendContactNotification(name, email, subject, message);

    // 3. Send confirmation to user
    await sendContactConfirmation(email);

    return { success: true };
  } catch (error: any) {
    console.error('Contact submission error:', error);
    return { success: false, error: 'Failed to send message. Please try again later.' };
  }
}

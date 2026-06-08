import { Resend } from 'resend';
import nodemailer from 'nodemailer';

const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.AUTH_URL || 'http://localhost:3000'}/auth/verify-email?token=${token}`;
  const subject = 'Verify your email — PlateUp';
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #0e6529;">Welcome to PlateUp 🍲</h2>
      <p>Click the button below to verify your email address and access your account.</p>
      <a href="${confirmLink}"
         style="display:inline-block;padding:12px 24px;background:#0e6529;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0;">
        Verify Email
      </a>
      <p style="color:#666;font-size:13px;">Or copy this link: <br/><a href="${confirmLink}">${confirmLink}</a></p>
      <p style="color:#999;font-size:12px;">This link expires in 24 hours.</p>
    </div>
  `;

  // ── 1. Try Resend ────────────────────────────────────────────────────────
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({ from: fromEmail, to: email, subject, html });
      return { success: true };
    } catch (error) {
      console.error('[Email] Resend failed, trying Nodemailer fallback:', error);
    }
  }

  // ── 2. Try Nodemailer fallback ───────────────────────────────────────────
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await transporter.sendMail({ from: fromEmail, to: email, subject, html });
      return { success: true };
    } catch (error) {
      console.error('[Email] Nodemailer failed:', error);
    }
  }

  // ── 3. Dev mode: log token to console ───────────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    console.log('\n─────────────────────────────────────────────────');
    console.log('[DEV MODE] No email provider configured.');
    console.log(`Verification link for ${email}:`);
    console.log(confirmLink);
    console.log('─────────────────────────────────────────────────\n');
    // Return success in dev so registration still works without email config
    return { success: true };
  }

  return { success: false, error: 'No email provider is configured.' };
};

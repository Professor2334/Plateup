import { Resend } from 'resend';
import nodemailer from 'nodemailer';

const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.AUTH_URL || 'http://localhost:3000'}/auth/verify-email?token=${token}`;
  const subject = 'Welcome to PlateUp — verify your email';
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #fff; border-radius: 12px;">
      <h2 style="color: #0e6529; margin-top: 0;">Welcome to PlateUp 🍲</h2>
      <p style="color: #333; font-size: 15px; line-height: 1.6;">
        Your account has been created and you can <strong>start using PlateUp right away</strong> — no waiting required.
      </p>
      <p style="color: #333; font-size: 15px; line-height: 1.6;">
        We recommend verifying your email to secure your account and unlock full access.
      </p>
      <a href="${confirmLink}"
         style="display:inline-block;padding:12px 28px;background:#0e6529;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;margin:20px 0;font-size:15px;">
        Verify My Email
      </a>
      <p style="color:#666;font-size:13px;">Or copy this link: <br/><a href="${confirmLink}" style="color:#0e6529;">${confirmLink}</a></p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="color:#999;font-size:12px; margin: 0;">This verification link expires in 5 minutes. If you did not create a PlateUp account, you can safely ignore this email.</p>
    </div>
  `;

  // Always log the link in development so you never get stuck if the email network fails!
  if (process.env.NODE_ENV !== 'production') {
    console.log('\n─────────────────────────────────────────────────');
    console.log(`[DEV PREVIEW] Verification link for ${email}:`);
    console.log(confirmLink);
    console.log('─────────────────────────────────────────────────\n');
  }

  // ── 1. Try Nodemailer ────────────────────────────────────────────────────
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const port = parseInt(process.env.SMTP_PORT || '465');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: port,
        secure: port === 465, // Use SSL for 465, STARTTLS for 587
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        tls: { rejectUnauthorized: false }, // Bypass local antivirus/firewall SSL interception
      });
      const fromLine = process.env.SMTP_FROM || process.env.SMTP_USER || fromEmail;
      await transporter.sendMail({ from: fromLine, to: email, subject, html });
      return { success: true };
    } catch (error) {
      console.error('[Email] Nodemailer failed, trying Resend fallback:', error);
    }
  }

  // ── 2. Try Resend fallback ───────────────────────────────────────────────
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({ from: fromEmail, to: email, subject, html });
      return { success: true };
    } catch (error) {
      console.error('[Email] Resend failed:', error);
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

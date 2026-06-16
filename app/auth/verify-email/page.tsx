import { verifyEmailToken } from '@/app/actions/auth/actions';
import Link from 'next/link';
import { VerifyEmailSuccess } from '@/components/auth/VerifyEmailSuccess';
import { redirect } from 'next/navigation';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify Email',
  description: 'Verify your PlateUp email address to activate your account.',
  robots: { index: false, follow: false },
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const token = searchParams.token as string;
  const successParam = searchParams.success as string;
  const emailParam = searchParams.email as string;

  // If the user is on the success URL, show the success UI immediately.
  if (successParam === 'true') {
    return (
      <div className="w-full rounded-[28px] bg-white p-8 sm:p-10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] text-center border border-gray-50 relative">
        <VerifyEmailSuccess email={emailParam} />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="w-full rounded-[24px] bg-white p-8 sm:p-12 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] text-center border border-gray-100">
        <h1 className="text-xl font-bold text-[var(--color-error)] mb-2">Invalid Request</h1>
        <p className="text-[var(--color-on-surface-variant)] text-sm mb-6">No verification token provided.</p>
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center w-full min-h-[48px] rounded-xl bg-[var(--color-primary)] text-white font-semibold text-[15px] hover:opacity-90 transition-opacity"
        >
          Back to Login
        </Link>
      </div>
    );
  }

  const result = await verifyEmailToken(token);

  if (result.success) {
    redirect(`/auth/verify-email?success=true&email=${encodeURIComponent(result.email || '')}`);
  }

  return (
    <div className="w-full rounded-[28px] bg-white p-8 sm:p-10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] text-center border border-gray-50 relative">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-[var(--color-error-container)]/50 rounded-full flex items-center justify-center mb-6">
          <span className="text-2xl">❌</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-error)] mb-3">Verification Failed</h1>
        <p className="text-[var(--color-on-surface-variant)] text-[15px] mb-8">
          {result.error || 'The verification link is invalid or has expired.'}
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center w-full min-h-[48px] rounded-xl border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] font-semibold text-[15px] hover:bg-[var(--color-surface-low)] transition-colors"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}

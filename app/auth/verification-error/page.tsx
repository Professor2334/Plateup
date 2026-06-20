import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verification Failed',
  description: 'Your email verification link is invalid or has expired.',
  robots: { index: false, follow: false },
};

export default function VerificationErrorPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const errorParam = searchParams.error as string;
  let errorMessage = 'The verification link is invalid or has expired.';
  
  if (errorParam === 'missing_token') {
    errorMessage = 'No verification token provided.';
  } else if (errorParam) {
    errorMessage = decodeURIComponent(errorParam);
  }

  return (
    <div className="w-full rounded-[28px] bg-[var(--color-surface)] p-8 sm:p-10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] text-center border border-gray-50 relative">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-[var(--color-error-container)]/50 rounded-full flex items-center justify-center mb-6">
          <span className="text-2xl">❌</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-error)] mb-3">Verification Failed</h1>
        <p className="text-[var(--color-on-surface-variant)] text-[15px] mb-8">
          {errorMessage}
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

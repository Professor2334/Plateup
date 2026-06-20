import { VerifyEmailSuccess } from '@/components/auth/VerifyEmailSuccess';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Email Verified',
  description: 'Your email has been successfully verified.',
  robots: { index: false, follow: false },
};

export default function VerifiedPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const emailParam = searchParams.email as string;

  return (
    <div className="w-full rounded-[28px] bg-[var(--color-surface)] p-8 sm:p-10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] text-center border border-gray-50 relative">
      <VerifyEmailSuccess email={emailParam} />
    </div>
  );
}

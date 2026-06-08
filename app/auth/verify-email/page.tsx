import { verifyEmailToken } from '@/app/actions/auth/actions';
import Link from 'next/link';

export const metadata = {
  title: 'Verify Email | PlateUp',
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const token = searchParams.token as string;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 bg-surface-lowest">
        <div className="w-full max-w-md space-y-6 rounded-2xl bg-surface p-8 shadow-sm text-center border border-outline-variant">
          <h1 className="text-xl font-bold text-error">Invalid Request</h1>
          <p className="text-on-surface-variant text-sm">No verification token provided.</p>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center w-full min-h-[44px] rounded-xl bg-primary text-on-primary font-semibold text-sm hover:opacity-90 transition-opacity mt-4"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  const result = await verifyEmailToken(token);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-surface-lowest">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-surface p-8 shadow-sm text-center border border-outline-variant">
        {result.success ? (
          <>
            <div className="text-5xl">✅</div>
            <h1 className="text-2xl font-bold text-primary">Email Verified!</h1>
            <p className="text-on-surface-variant text-sm">
              Your email has been successfully verified. You can now sign in to your account.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center w-full min-h-[44px] rounded-xl bg-primary text-on-primary font-semibold text-sm hover:opacity-90 transition-opacity mt-4"
            >
              Continue to Login
            </Link>
          </>
        ) : (
          <>
            <div className="text-5xl">❌</div>
            <h1 className="text-xl font-bold text-error">Verification Failed</h1>
            <p className="text-on-surface-variant text-sm">
              {result.error || 'The verification link is invalid or has expired.'}
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center w-full min-h-[44px] rounded-xl border border-outline-variant text-on-surface font-semibold text-sm hover:bg-surface-low transition-colors mt-4"
            >
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

import { verifyEmailToken } from '@/app/actions/auth/actions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const token = searchParams.token as string;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface-lowest)] px-4">
        <div className="w-full max-w-md space-y-6 rounded-xl bg-[var(--color-surface)] p-8 shadow-sm text-center">
          <h1 className="text-xl font-bold text-[var(--color-error)]">Invalid Request</h1>
          <p className="text-[var(--color-on-surface-variant)]">No verification token provided.</p>
          <Link href="/auth/login"><Button className="w-full mt-4">Back to Login</Button></Link>
        </div>
      </div>
    );
  }

  const result = await verifyEmailToken(token);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface-lowest)] px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-[var(--color-surface)] p-8 shadow-sm text-center">
        {result.success ? (
          <>
            <h1 className="text-2xl font-bold text-[var(--color-primary)]">Email Verified!</h1>
            <p className="text-[var(--color-on-surface-variant)]">Your email has been successfully verified. You can now access your account.</p>
            <Link href="/auth/login">
              <Button className="w-full mt-4">Continue to Login</Button>
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-[var(--color-error)]">Verification Failed</h1>
            <p className="text-[var(--color-on-surface-variant)]">{result.error || 'The verification link is invalid or has expired.'}</p>
            <Link href="/auth/login">
              <Button variant="outline" className="w-full mt-4">Back to Login</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

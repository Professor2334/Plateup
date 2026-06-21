import { verifyEmailToken } from '@/app/actions/auth/actions';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const token = searchParams.token as string;

  if (!token) {
    redirect('/auth/verification-error?error=missing_token');
  }

  const result = await verifyEmailToken(token);

  if (result.success) {
    redirect(`/auth/verified?email=${encodeURIComponent(result.email || '')}`);
  } else {
    redirect(`/auth/verification-error?error=${encodeURIComponent(result.error || 'unknown_error')}`);
  }
}

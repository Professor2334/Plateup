import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { AuthDivider } from '@/components/auth/AuthDivider';
import Link from 'next/link';

export const metadata = {
  title: 'Sign In | PlateUp',
  description: 'Sign in to your PlateUp account.',
};

export default function LoginPage() {
  return (
    <div className="w-full space-y-10 md:space-y-8">
      <div className="text-center md:text-left mb-12 md:mb-10">
        <h2 className="text-on-surface-variant text-headline-large font-bold">
          Welcome back
        </h2>
        <p className="mt-1 md:mt-3 text-body-large font-normal text-on-surface-variant opacity-80">
          Sign in to your PlateUp account to continue
        </p>
      </div>

      <GoogleButton label="Continue with Google" />

      <AuthDivider />

      <Suspense fallback={<div>Loading form...</div>}>
        <LoginForm />
      </Suspense>

      <div className="text-center text-[15px] !mt-4 md:!mt-8">
        <span className="text-[var(--color-on-surface-variant)]">Don't have an account? </span>
        <Link href="/auth/register" className="font-bold text-[var(--color-primary)] hover:underline">
          Create account
        </Link>
      </div>
    </div>
  );
}

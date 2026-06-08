import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';

export const metadata = {
  title: 'Sign In | PlateUp',
  description: 'Sign in to your PlateUp account.',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-surface-lowest">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-surface p-8 shadow-sm border border-outline-variant">
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold text-primary">PlateUp</Link>
          <h1 className="mt-4 text-xl font-bold text-on-surface">Welcome back</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Sign in to your account to manage your meal plans.
          </p>
        </div>

        <LoginForm />

        <div className="text-center text-sm">
          <span className="text-on-surface-variant">Don&apos;t have an account? </span>
          <Link href="/auth/register" className="font-semibold text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

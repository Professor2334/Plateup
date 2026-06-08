import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface-lowest)] px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">Welcome back to PlateUp</h1>
          <p className="mt-2 text-sm text-[var(--color-on-surface-variant)]">
            Sign in to your account to manage your meal plans.
          </p>
        </div>
        
        <LoginForm />

        <div className="text-center text-sm">
          <span className="text-[var(--color-on-surface-variant)]">Don't have an account? </span>
          <Link href="/auth/register" className="font-medium text-[var(--color-primary)] hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

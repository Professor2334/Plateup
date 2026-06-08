import { RegisterForm } from '@/components/auth/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface-lowest)] px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">Create an account</h1>
          <p className="mt-2 text-sm text-[var(--color-on-surface-variant)]">
            Join PlateUp to start planning your Nigerian meals.
          </p>
        </div>
        
        <RegisterForm />

        <div className="text-center text-sm">
          <span className="text-[var(--color-on-surface-variant)]">Already have an account? </span>
          <Link href="/auth/login" className="font-medium text-[var(--color-primary)] hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

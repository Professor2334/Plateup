import { RegisterForm } from '@/components/auth/RegisterForm';
import Link from 'next/link';

export const metadata = {
  title: 'Create Account | PlateUp',
  description: 'Join PlateUp to start planning budget-aware Nigerian meals.',
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-surface-lowest">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-surface p-8 shadow-sm border border-outline-variant">
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold text-primary">PlateUp</Link>
          <h1 className="mt-4 text-xl font-bold text-on-surface">Create your account</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Join PlateUp to start planning your Nigerian meals.
          </p>
        </div>

        <RegisterForm />

        <div className="text-center text-sm">
          <span className="text-on-surface-variant">Already have an account? </span>
          <Link href="/auth/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

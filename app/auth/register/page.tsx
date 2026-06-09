import { RegisterForm } from '@/components/auth/RegisterForm';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { AuthDivider } from '@/components/auth/AuthDivider';
import Link from 'next/link';

export const metadata = {
  title: 'Create Account | PlateUp',
  description: 'Join PlateUp to start planning budget-aware Nigerian meals.',
};

export default function RegisterPage() {
  return (
    <div className="w-full space-y-8">
      <div className="text-left mb-10">
        <h2 className="text-on-surface-variant text-headline-large font-bold">
          Create your PlateUp <br /> account
        </h2>
        <p className="mt-3 text-body-large font-normal text-on-surface-variant opacity-80">
          Join PlateUp to start planning your Nigerian meals.
        </p>
      </div>

      <GoogleButton label="Continue with Google" />

      <AuthDivider />

      <RegisterForm />

      <div className="text-center text-[15px] mt-8">
        <span className="text-[var(--color-on-surface-variant)]">Already have an account? </span>
        <Link href="/auth/login" className="font-bold text-[var(--color-primary)] hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}

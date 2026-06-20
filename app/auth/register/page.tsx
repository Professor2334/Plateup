import { RegisterForm } from '@/components/auth/RegisterForm';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { AuthDivider } from '@/components/auth/AuthDivider';
import Link from 'next/link';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account',
  description:
    'Join PlateUp to start planning budget-friendly Nigerian meals for your household. Set your budget, add ingredients, and get a 7-day meal plan instantly.',
  alternates: { canonical: '/auth/register' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Create Account | PlateUp',
    description: 'Join PlateUp to start planning budget-friendly Nigerian meals for your household. Set your budget, add ingredients, and get a 7-day meal plan instantly.',
    url: 'https://plateup.com.ng/auth/register',
  },
  twitter: {
    title: 'Create Account | PlateUp',
    description: 'Join PlateUp to start planning budget-friendly Nigerian meals for your household. Set your budget, add ingredients, and get a 7-day meal plan instantly.',
  },
};

export default function RegisterPage() {
  return (
    <div className="w-full space-y-10 md:space-y-8">
      <div className="text-center md:text-left mb-12 md:mb-10">
        <h2 className="text-on-surface-variant text-headline-large font-bold">
          Create your PlateUp <br className="hidden md:block" /> account
        </h2>
        <p className="mt-1 md:mt-3 text-body-large font-normal text-on-surface-variant opacity-80">
          Join PlateUp to start planning your Nigerian meals.
        </p>
      </div>

      <GoogleButton label="Continue with Google" />

      <AuthDivider />

      <RegisterForm />

      <div className="text-center text-[15px] !mt-4 md:!mt-8">
        <span className="text-[var(--color-on-surface-variant)]">Already have an account? </span>
        <Link href="/auth/login" className="font-bold text-[var(--color-primary)] hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}

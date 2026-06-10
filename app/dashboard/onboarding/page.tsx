import { OnboardingForm } from '@/components/onboarding/OnboardingForm';

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface-lowest)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <OnboardingForm />
      </div>
    </div>
  );
}

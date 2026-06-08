import { OnboardingForm } from '@/components/onboarding/OnboardingForm';

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface-lowest)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl space-y-8 rounded-2xl bg-[var(--color-surface)] p-8 shadow-sm border border-[var(--color-outline-variant)]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">Personalize PlateUp</h1>
          <p className="mt-3 text-sm text-[var(--color-on-surface-variant)]">
            Tell us a bit about your household to help the AI generate tailored, budget-friendly meal plans for you.
          </p>
        </div>
        
        <OnboardingForm />
      </div>
    </div>
  );
}

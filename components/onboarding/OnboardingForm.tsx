'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { completeOnboarding } from '@/app/actions/onboarding/actions';
import { useRouter } from 'next/navigation';

export function OnboardingForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const householdSizes = [
    { value: '1', label: '1 Person' },
    { value: '2', label: '2 People' },
    { value: '3-4', label: '3-4 People' },
    { value: '5+', label: '5+ People' },
  ];

  const primaryGoals = [
    { value: 'save-money', label: 'Save Money' },
    { value: 'save-time', label: 'Save Time' },
    { value: 'reduce-waste', label: 'Reduce Food Waste' },
    { value: 'eat-healthier', label: 'Eat Healthier' },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await completeOnboarding(formData);
    
    console.log('Onboarding result:', result);

    if (result && !result.success) {
      setError(result.error || 'Failed to complete onboarding');
      setLoading(false);
    } else {
      console.log('Navigating to dashboard...');
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Step 1: Household Size */}
      <div className="space-y-3">
        <label className="text-base font-semibold text-[var(--color-primary)]">
          1. What is your household size?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {householdSizes.map((size) => (
            <label
              key={size.value}
              className="flex items-center space-x-3 rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-4 hover:bg-[var(--color-surface-container-low)] cursor-pointer"
            >
              <input
                type="radio"
                name="householdSize"
                value={size.value}
                required
                className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <span className="text-sm font-medium text-[var(--color-on-surface)]">
                {size.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Step 2: Primary Goal */}
      <div className="space-y-3">
        <label className="text-base font-semibold text-[var(--color-primary)]">
          2. What is your primary goal?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {primaryGoals.map((goal) => (
            <label
              key={goal.value}
              className="flex items-center space-x-3 rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-4 hover:bg-[var(--color-surface-container-low)] cursor-pointer"
            >
              <input
                type="radio"
                name="primaryGoal"
                value={goal.value}
                required
                className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <span className="text-sm font-medium text-[var(--color-on-surface)]">
                {goal.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {error && <p className="text-[var(--color-error)] text-sm">{error}</p>}
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Saving...' : 'Complete Onboarding'}
      </Button>
    </form>
  );
}

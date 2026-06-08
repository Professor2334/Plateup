'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateMealPlan } from '@/app/actions/meal-plans/actions';
import type { MealPlanResponse } from '@/lib/deepseek';

interface GenerateMealFormProps {
  onPlanGenerated: (plan: MealPlanResponse, formData: FormData, id: string) => void;
  onLoadingChange: (isLoading: boolean) => void;
}

export function GenerateMealForm({ onPlanGenerated, onLoadingChange }: GenerateMealFormProps) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    onLoadingChange(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await generateMealPlan(formData);

    if (result && !result.success) {
      setError(result.error || 'Failed to generate plan.');
      setLoading(false);
      onLoadingChange(false);
    } else if (result.success && result.data && result.id) {
      onPlanGenerated(result.data, formData, result.id);
      setLoading(false);
      onLoadingChange(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-6">
      <h2 className="text-xl font-bold text-[var(--color-primary)]">Plan Your Week</h2>
      <p className="text-sm text-[var(--color-on-surface-variant)]">Enter your budget and ingredients to generate a realistic Nigerian meal plan.</p>
      
      <div className="space-y-1">
        <label htmlFor="budget" className="text-sm font-medium">Weekly Budget (NGN)</label>
        <Input id="budget" name="budget" type="number" min="1000" placeholder="e.g. 15000" required disabled={loading} />
      </div>

      <div className="space-y-1">
        <label htmlFor="ingredients" className="text-sm font-medium">Available Ingredients</label>
        <textarea 
          id="ingredients" 
          name="ingredients" 
          placeholder="e.g. Rice, Beans, Palm Oil, Maggi" 
          required 
          disabled={loading}
          className="flex min-h-[100px] w-full rounded-md border border-[var(--color-outline)] bg-[var(--color-surface)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        />
      </div>

      {error && <p className="text-[var(--color-error)] text-sm">{error}</p>}
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Generating Plan...' : 'Generate Meal Plan'}
      </Button>
    </form>
  );
}

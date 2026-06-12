'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateMealPlan } from '@/app/actions/meal-plans/actions';
import type { MealPlanResponse } from '@/lib/deepseek';
import { X, CheckCircle2, Sparkles, Plus } from 'lucide-react';

interface GenerateMealFormProps {
  onPlanGenerated: (plan: MealPlanResponse, formData: FormData, id: string) => void;
  onLoadingChange: (isLoading: boolean) => void;
}

export function GenerateMealForm({ onPlanGenerated, onLoadingChange }: GenerateMealFormProps) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const suggestedIngredients = ['Rice', 'Beans', 'Garri', 'Chicken', 'Plantain', 'Eggs', 'Tomatoes'];

  const handleAddIngredient = (ingredient: string) => {
    const trimmed = ingredient.trim();
    if (trimmed && !ingredients.map(i => i.toLowerCase()).includes(trimmed.toLowerCase())) {
      setIngredients([...ingredients, trimmed]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddIngredient(inputValue);
    }
  };

  const removeIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter(i => i !== ingredientToRemove));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient.');
      return;
    }

    setLoading(true);
    onLoadingChange(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    formData.set('ingredients', ingredients.join(', '));

    const result = await generateMealPlan(formData);

    if (result && !result.success) {
      setError(result.error || 'Failed to generate plan.');
      setLoading(false);
      onLoadingChange(false);
    } else if (result.success && result.data && result.id) {
      const finalFormData = new FormData();
      finalFormData.set('budget', formData.get('budget') as string);
      finalFormData.set('ingredients', ingredients.join(', '));
      
      onPlanGenerated(result.data, finalFormData, result.id);
      setLoading(false);
      onLoadingChange(false);
    }
  };

  return (
    <div className="rounded-[24px] bg-white p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 relative">
      <div className="mb-5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)] text-[var(--color-primary)] text-[0.6875rem] font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          AI Meal Planner
        </div>
        <h2 className="text-[clamp(1.25rem,2vw+0.5rem,1.5rem)] font-bold text-[var(--color-on-surface-variant)] tracking-tight">Plan Your Week</h2>
        <p className="text-sm text-[var(--color-on-surface-variant)] opacity-[0.73] mt-1 leading-relaxed">Set your budget and ingredients to get started.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="budget" className="text-[0.8125rem] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider">Weekly Budget</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] font-bold text-base select-none">₦</span>
            <input 
              id="budget" 
              name="budget" 
              type="number" 
              min="1000" 
              placeholder="15000" 
              required 
              disabled={loading} 
              className="w-full h-12 pl-10 pr-4 rounded-xl bg-[#f9fafb] border border-transparent focus:bg-white focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20 transition-all text-base font-medium outline-none disabled:opacity-50 shadow-inner hover:bg-gray-50"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[0.8125rem] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider">Available Ingredients</label>
          <div className="min-h-[100px] w-full rounded-xl bg-[#f9fafb] border border-transparent focus-within:bg-white focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:ring-opacity-20 transition-all p-3 flex flex-col cursor-text disabled:opacity-50 shadow-inner hover:bg-gray-50" onClick={() => document.getElementById('ingredient-input')?.focus()}>
            <div className="flex flex-wrap gap-2 mb-1">
              {ingredients.map((ing, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white shadow-sm text-[0.8125rem] font-semibold text-[var(--color-on-surface)] group animate-in zoom-in-95 duration-200">
                  {ing}
                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeIngredient(ing);
                    }}
                    className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-error)] transition-colors focus:outline-none rounded-full p-0.5 hover:bg-[var(--color-error-container)]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              <input 
                id="ingredient-input"
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={ingredients.length === 0 ? "e.g. Rice, Beans (Press Enter)" : "Add more..."}
                disabled={loading}
                className="flex-1 min-w-[140px] bg-transparent border-none focus:outline-none focus:ring-0 text-[0.875rem] font-medium py-1.5 px-2 outline-none h-auto placeholder-[var(--color-outline-variant)]"
                onBlur={() => {
                  if (inputValue.trim()) {
                    handleAddIngredient(inputValue);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)] text-[var(--color-error)] text-sm font-semibold flex items-start gap-2 animate-in fade-in duration-200">
            <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        <div className="pt-1">
          <Button type="submit" className="w-full h-12 text-[0.9375rem] font-bold shadow-[0_4px_14px_rgba(17,94,59,0.25)] hover:shadow-[0_6px_20px_rgba(17,94,59,0.3)] transition-all rounded-xl" disabled={loading}>
            {loading ? 'Generating...' : 'Generate My Meal Plan'}
          </Button>
        </div>
      </form>
    </div>
  );
}

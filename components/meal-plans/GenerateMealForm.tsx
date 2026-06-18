'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { generateMealPlan } from '@/app/actions/meal-plans/actions';
import type { MealPlanResponse } from '@/lib/deepseek';
import { X, Sparkles } from 'lucide-react';

interface GenerateMealFormProps {
  onPlanGenerated: (plan: MealPlanResponse, formData: FormData, id: string) => void;
  onLoadingChange: (isLoading: boolean) => void;
  budgetFriendly?: boolean;
  initialBudget?: string;
  initialIngredients?: string[];
  isRegenerating?: boolean;
}

export function GenerateMealForm({ onPlanGenerated, onLoadingChange, budgetFriendly, initialBudget, initialIngredients, isRegenerating = false }: GenerateMealFormProps) {
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>(initialIngredients || []);
  const [inputValue, setInputValue] = useState('');

  const [budgetError, setBudgetError] = useState('');
  const [ingredientError, setIngredientError] = useState('');
  const [budgetTouched, setBudgetTouched] = useState(false);
  const [ingredientsTouched, setIngredientsTouched] = useState(false);
  const ingredientsRef = useRef(ingredients);
  ingredientsRef.current = ingredients;

  const suggestedIngredients = ['Rice', 'Beans', 'Garri', 'Chicken', 'Plantain', 'Eggs', 'Tomatoes'];

  const handleAddIngredient = (ingredient: string) => {
    const trimmed = ingredient.trim();
    if (trimmed && !ingredients.map(i => i.toLowerCase()).includes(trimmed.toLowerCase())) {
      const next = [...ingredients, trimmed];
      setIngredients(next);
      ingredientsRef.current = next;
      setInputValue('');
      if (ingredientError) setIngredientError('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddIngredient(inputValue);
    }
  };

  const removeIngredient = (ingredientToRemove: string) => {
    const next = ingredients.filter(i => i !== ingredientToRemove);
    setIngredients(next);
    ingredientsRef.current = next;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setBudgetTouched(true);
    setIngredientsTouched(true);

    const formData = new FormData(e.currentTarget);
    const budget = formData.get('budget') as string;
    const isBudgetEmpty = !budget || budget.trim() === '';
    const isIngredientsEmpty = ingredientsRef.current.length === 0;

    if (isBudgetEmpty && isIngredientsEmpty) {
      setBudgetError('Please enter your weekly budget.');
      setIngredientError('Please enter at least one available ingredient.');
      return;
    }

    if (isBudgetEmpty) {
      setBudgetError('Please enter your weekly budget.');
      setIngredientError('');
      return;
    }

    if (isIngredientsEmpty) {
      setIngredientError('Please enter at least one available ingredient.');
      setBudgetError('');
      return;
    }

    setBudgetError('');
    setIngredientError('');
    setServerError('');

    setLoading(true);
    onLoadingChange(true);

    formData.set('ingredients', ingredientsRef.current.join(', '));
    if (budgetFriendly) {
      formData.set('budgetFriendly', 'true');
    }

    const result = await generateMealPlan(formData);

    if (result && !result.success) {
      setServerError(result.error || 'Failed to generate plan.');
      setLoading(false);
      onLoadingChange(false);
    } else if (result.success && result.data && result.id) {
      const finalFormData = new FormData();
      finalFormData.set('budget', formData.get('budget') as string);
      finalFormData.set('ingredients', ingredientsRef.current.join(', '));

      onPlanGenerated(result.data, finalFormData, result.id);
      setLoading(false);
      onLoadingChange(false);
    }
  };

  const isFormDisabled = loading || isRegenerating;

  const handleBudgetBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setBudgetTouched(true);
    const value = e.currentTarget.value;
    if (!value || value.trim() === '') {
      setBudgetError('Please enter your weekly budget.');
    } else if (budgetError) {
      setBudgetError('');
    }
  };

  const handleContainerBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIngredientsTouched(true);
    if (ingredientsRef.current.length === 0) {
      setIngredientError('Please enter at least one available ingredient.');
    } else if (ingredientError) {
      setIngredientError('');
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

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
              disabled={isFormDisabled}
              onFocus={() => {
                if (!budgetTouched) setBudgetTouched(true);
              }}
              onChange={() => {
                if (budgetError) setBudgetError('');
              }}
              onBlur={handleBudgetBlur}
              className="w-full h-12 pl-10 pr-4 rounded-xl bg-[#f9fafb] border border-transparent focus:bg-white focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20 transition-all text-base font-medium outline-none disabled:opacity-50 shadow-inner hover:bg-gray-50"
            />
          </div>
          {budgetError && budgetTouched && (
            <p className="text-[0.8125rem] font-semibold text-[var(--color-error)] flex items-center gap-1.5 animate-in fade-in duration-200">
              <X className="w-3.5 h-3.5" />
              {budgetError}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-[0.8125rem] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider">Available Ingredients</label>
          <div
            tabIndex={-1}
            className="min-h-[100px] w-full rounded-xl bg-[#f9fafb] border border-transparent focus-within:bg-white focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:ring-opacity-20 transition-all p-3 flex flex-col cursor-text disabled:opacity-50 shadow-inner hover:bg-gray-50"
            onClick={() => document.getElementById('ingredient-input')?.focus()}
            onFocus={() => {
              if (!ingredientsTouched) setIngredientsTouched(true);
            }}
            onBlur={handleContainerBlur}
          >
            <div className="flex flex-wrap gap-2 mb-1">
              {ingredients.map((ing, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white shadow-sm text-[0.8125rem] font-semibold text-[var(--color-on-surface)] group animate-in zoom-in-95 duration-200">
                  {ing}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isFormDisabled) removeIngredient(ing);
                    }}
                    disabled={isFormDisabled}
                    className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-error)] transition-colors focus:outline-none rounded-full p-0.5 hover:bg-[var(--color-error-container)] disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              <input
                id="ingredient-input"
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (ingredientError) setIngredientError('');
                }}
                onKeyDown={handleKeyDown}
                placeholder={ingredients.length === 0 ? "e.g. Rice, Beans (Press Enter)" : "Add more..."}
                disabled={isFormDisabled}
                className="flex-1 min-w-[140px] bg-transparent border-none focus:outline-none focus:ring-0 text-[0.875rem] font-medium py-1.5 px-2 outline-none h-auto placeholder-[var(--color-outline-variant)]"
                onBlur={() => {
                  if (inputValue.trim() && !isFormDisabled) {
                    handleAddIngredient(inputValue);
                  }
                }}
              />
            </div>
          </div>
          {ingredientError && ingredientsTouched && (
            <p className="text-[0.8125rem] font-semibold text-[var(--color-error)] flex items-center gap-1.5 animate-in fade-in duration-200">
              <X className="w-3.5 h-3.5" />
              {ingredientError}
            </p>
          )}
        </div>

        {serverError && (
          <div className="p-3 rounded-xl bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)] text-[var(--color-error)] text-sm font-semibold flex items-start gap-2 animate-in fade-in duration-200">
            <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>{serverError}</p>
          </div>
        )}

        <div className="pt-1">
          <Button type="submit" className="w-full h-12 text-[0.9375rem] font-bold shadow-[0_4px_14px_rgba(17,94,59,0.25)] hover:shadow-[0_6px_20px_rgba(17,94,59,0.3)] transition-all rounded-xl" disabled={isFormDisabled}>
            {loading ? 'Generating...' : isRegenerating ? 'Generating...' : 'Generate My Meal Plan'}
          </Button>
        </div>
      </form>
    </div>
  );
}

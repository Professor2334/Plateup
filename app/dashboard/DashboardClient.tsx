'use client';

import { useState, useEffect } from 'react';
import { GenerateMealForm } from '@/components/meal-plans/GenerateMealForm';
import { MealPlanSkeleton } from '@/components/meal-plans/MealPlanSkeleton';
import type { MealPlanResponse } from '@/lib/deepseek';
import { Button } from '@/components/ui/button';
import { saveMealPlan, deleteMealPlan } from '@/app/actions/meal-plans/actions';
import { useRouter } from 'next/navigation';

interface DashboardClientProps {
  initialHistory: any[];
}

export function DashboardClient({ initialHistory }: DashboardClientProps) {
  const [history, setHistory] = useState(initialHistory);
  
  useEffect(() => {
    setHistory(initialHistory);
  }, [initialHistory]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<MealPlanResponse | null>(null);
  const [activeBudget, setActiveBudget] = useState(0);
  const [activeIngredients, setActiveIngredients] = useState('');
  const router = useRouter();

  const handlePlanGenerated = (plan: MealPlanResponse, budget: number, ingredients: string) => {
    setGeneratedPlan(plan);
    setActiveBudget(budget);
    setActiveIngredients(ingredients);
  };

  const handleSavePlan = async () => {
    if (!generatedPlan) return;
    setSaving(true);
    const res = await saveMealPlan(activeBudget, activeIngredients, generatedPlan.mealPlan, generatedPlan.shoppingList);
    setSaving(false);
    if (res.success) {
      alert('Meal plan saved successfully!');
      router.refresh(); // Refetch initialHistory
    } else {
      alert(res.error || 'Failed to save');
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (confirm('Are you sure you want to delete this saved plan?')) {
      // Optimistic UI update
      setHistory(prev => prev.filter(plan => plan.id !== id));
      await deleteMealPlan(id);
      router.refresh();
    }
  };

  const handleViewPlan = (plan: any) => {
    setGeneratedPlan({
      mealPlan: plan.generatedPlan,
      shoppingList: plan.shoppingList,
      estimatedCost: plan.budget, // approx
      budgetStatus: 'WITHIN_BUDGET'
    });
    setActiveBudget(plan.budget);
    setActiveIngredients(plan.ingredients);
  };

  const shareViaWhatsApp = () => {
    if (!generatedPlan) return;
    let text = `*My PlateUp Weekly Meal Plan*\n\n`;
    generatedPlan.mealPlan.forEach(day => {
      text += `*${day.day}*\nBreakfast: ${day.breakfast}\nLunch: ${day.lunch}\nDinner: ${day.dinner}\n\n`;
    });
    text += `*Shopping List*\n`;
    generatedPlan.shoppingList.forEach(item => {
      text += `- ${item.item}: ${item.quantity}\n`;
    });
    
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar: Form & History */}
      <div className="lg:col-span-4 space-y-8">
        <GenerateMealForm 
          onPlanGenerated={(plan, formData) => {
            const b = parseFloat(formData.get('budget') as string);
            const i = formData.get('ingredients') as string;
            handlePlanGenerated(plan, b, i);
          }}
          onLoadingChange={setLoading}
        />

        <div className="rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-6">
          <h2 className="text-lg font-bold text-[var(--color-primary)] mb-4">Saved Meal Plans</h2>
          {history.length === 0 ? (
            <p className="text-sm text-[var(--color-on-surface-variant)]">No saved plans yet.</p>
          ) : (
            <div className="space-y-3">
              {history.map((plan: any) => (
                <div key={plan.id} className="p-3 border rounded-lg flex justify-between items-center hover:bg-[var(--color-surface-container-low)]">
                  <div>
                    <p className="text-sm font-semibold">NGN {plan.budget}</p>
                    <p className="text-xs text-[var(--color-on-surface-variant)] truncate w-32">{plan.ingredients}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleViewPlan(plan)} className="text-xs text-[var(--color-primary)] font-medium hover:underline">View</button>
                    <button onClick={() => handleDeletePlan(plan.id)} className="text-xs text-[var(--color-error)] font-medium hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content: Loading, Empty, or Plan */}
      <div className="lg:col-span-8">
        {loading ? (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[var(--color-primary)]">Generating your meal plan...</h1>
            <p className="text-[var(--color-on-surface-variant)]">This takes about 10-15 seconds. Hang tight!</p>
            <MealPlanSkeleton />
          </div>
        ) : generatedPlan ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[var(--color-primary)]">Your Meal Plan</h1>
                <p className="text-[var(--color-on-surface-variant)] mt-1">
                  Budget: NGN {activeBudget} 
                  <span className="ml-2 px-2 py-1 bg-[var(--color-surface-container)] rounded text-xs font-semibold">
                    {generatedPlan.budgetStatus.replace('_', ' ')}
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={shareViaWhatsApp}>Share via WhatsApp</Button>
                <Button onClick={handleSavePlan} disabled={saving}>{saving ? 'Saving...' : 'Save Plan'}</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedPlan.mealPlan.map((dayPlan, idx) => (
                <div key={idx} className="border border-[var(--color-outline-variant)] rounded-lg p-4 space-y-3 bg-[var(--color-surface)]">
                  <h3 className="font-bold text-[var(--color-primary)] border-b pb-2">{dayPlan.day}</h3>
                  <div className="text-sm">
                    <span className="font-semibold block text-[var(--color-secondary)]">Breakfast</span>
                    <span className="text-[var(--color-on-surface)]">{dayPlan.breakfast}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold block text-[var(--color-secondary)]">Lunch</span>
                    <span className="text-[var(--color-on-surface)]">{dayPlan.lunch}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold block text-[var(--color-secondary)]">Dinner</span>
                    <span className="text-[var(--color-on-surface)]">{dayPlan.dinner}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border border-[var(--color-outline-variant)] rounded-lg p-6 bg-[var(--color-surface)]">
              <h2 className="text-xl font-bold text-[var(--color-primary)] mb-4">Shopping List</h2>
              <ul className="space-y-2 list-disc list-inside">
                {generatedPlan.shoppingList.map((item, idx) => (
                  <li key={idx} className="text-sm text-[var(--color-on-surface)]">
                    <span className="font-medium">{item.item}</span> - {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--color-outline-variant)] bg-[var(--color-surface-lowest)] p-12 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
            <h3 className="text-lg font-medium text-[var(--color-on-surface-variant)]">No meal plan active</h3>
            <p className="mt-1 text-sm text-[var(--color-on-surface-variant)] opacity-80">
              Use the form to generate a new 7-day budget-aware Nigerian meal plan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

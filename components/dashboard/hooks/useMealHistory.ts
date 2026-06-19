import { useState, useCallback } from 'react';
import { MealPlanModel } from '@/types';
import { deleteMealPlan, deleteAllMealPlans } from '@/app/actions/meal-plans/actions';
import { useRouter } from 'next/navigation';

export function useMealHistory(initialHistory: MealPlanModel[]) {
  const router = useRouter();
  const [history, setHistory] = useState<MealPlanModel[]>(initialHistory);

  const [deleteModalPlanId, setDeleteModalPlanId] = useState<string | null>(null);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);

  const requestDeletePlan = useCallback((id: string) => {
    setDeleteModalPlanId(id);
  }, []);

  const confirmDeletePlan = useCallback(async () => {
    if (!deleteModalPlanId) return;
    const id = deleteModalPlanId;
    setHistory(prev => prev.filter(plan => plan.id !== id));
    setDeleteModalPlanId(null);
    await deleteMealPlan(id);
    router.refresh();
  }, [deleteModalPlanId, router]);

  const requestClearAllHistory = useCallback(() => {
    if (history.length === 0) return;
    setIsClearAllModalOpen(true);
  }, [history.length]);

  const confirmClearAllHistory = useCallback(async () => {
    setHistory([]);
    setIsClearAllModalOpen(false);
    await deleteAllMealPlans();
    router.refresh();
  }, [router]);

  const addPlanToHistory = useCallback((plan: MealPlanModel) => {
    setHistory(prev => [plan, ...prev]);
  }, []);

  const markPlanAsSaved = useCallback((id: string) => {
    setHistory(prev => prev.map(p => p.id === id ? { ...p, isSaved: true } : p));
  }, []);

  return {
    history,
    setHistory,
    requestDeletePlan,
    confirmDeletePlan,
    deleteModalPlanId,
    setDeleteModalPlanId,
    requestClearAllHistory,
    confirmClearAllHistory,
    isClearAllModalOpen,
    setIsClearAllModalOpen,
    addPlanToHistory,
    markPlanAsSaved
  };
}

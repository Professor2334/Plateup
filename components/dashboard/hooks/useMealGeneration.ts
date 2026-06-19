/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from 'react';
import { generateMealPlan, saveMealPlan } from '@/app/actions/meal-plans/actions';
import { Feedback } from '@/lib/feedback';
import type { MealPlanResponse } from '@/lib/deepseek';
import { MealPlanModel } from '@/types';
import { useRouter } from 'next/navigation';

interface UseMealGenerationProps {
  addPlanToHistory: (plan: MealPlanModel) => void;
  markPlanAsSaved: (id: string) => void;
  setActiveTab: (tab: any) => void;
}

export function useMealGeneration({ addPlanToHistory, markPlanAsSaved, setActiveTab }: UseMealGenerationProps) {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<MealPlanResponse | null>(null);
  const [alternativePlan, setAlternativePlan] = useState<MealPlanResponse | null>(null);
  const [activePlanView, setActivePlanView] = useState<'recommended' | 'budget-friendly'>('recommended');
  const [activeAlternativePlanId, setActiveAlternativePlanId] = useState<string | null>(null);
  const [activeBudget, setActiveBudget] = useState(0);
  const [activeIngredients, setActiveIngredients] = useState('');
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  const clearGeneratedPlan = useCallback(() => {
    setGeneratedPlan(null);
    setAlternativePlan(null);
    setActivePlanId(null);
    setActiveAlternativePlanId(null);
    setActivePlanView('recommended');
    setActiveBudget(0);
    setActiveIngredients('');
    setFormKey(prev => prev + 1);
  }, []);

  const handlePlanGenerated = useCallback((plan: MealPlanResponse, budget: number, ingredients: string, id: string) => {
    setGeneratedPlan(plan);
    setAlternativePlan(null);
    setActivePlanView('recommended');
    setActiveAlternativePlanId(null);
    setActiveBudget(budget);
    setActiveIngredients(ingredients);
    setActivePlanId(id);
    
    addPlanToHistory({
      id,
      userId: '',
      budget,
      ingredients,
      generatedPlan: plan.mealPlan,
      shoppingList: plan.shoppingList,
      isSaved: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedCost: plan.estimatedCost,
      estimatedCostRange: plan.estimatedCostRange
    });
  }, [addPlanToHistory]);

  const handleSavePlan = async () => {
    const idToSave = activePlanView === 'recommended' ? activePlanId : activeAlternativePlanId;
    if (!idToSave) return;
    
    if (!navigator.onLine) {
      Feedback.error.network();
      return;
    }

    setSaving(true);
    try {
      const res = await saveMealPlan(idToSave);
      if (res.success) {
        markPlanAsSaved(idToSave);
        Feedback.success.saved();
        clearGeneratedPlan();
        router.refresh();
      } else {
        Feedback.error.save();
      }
    } catch (e) {
      Feedback.error.save();
    } finally {
      setSaving(false);
    }
  };

  const handleRegeneratePlan = async () => {
    if (!navigator.onLine) {
      Feedback.error.network();
      return;
    }

    setIsRegenerating(true);
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    try {
      const formData = new FormData();
      formData.set('budget', activeBudget.toString());
      formData.set('ingredients', activeIngredients);
      
      const isBudgetFriendly = activePlanView === 'budget-friendly';
      if (isBudgetFriendly) {
        formData.set('budgetFriendly', 'true');
        if (generatedPlan) {
          formData.set('originalEstimatedCost', generatedPlan.estimatedCost.toString());
        }
      }

      // Add a client-side timeout wrapper to prevent infinite hanging if network drops mid-flight
      const timeoutPromise = new Promise<{ success: false, error: string }>((_, reject) => {
        setTimeout(() => reject(new Error('CLIENT_TIMEOUT')), 60000); // 60s
      });

      const result = await Promise.race([
        generateMealPlan(formData),
        timeoutPromise
      ]) as any;
      
      if (result && result.success && result.data && result.id) {
        if (isBudgetFriendly) {
          setAlternativePlan(result.data);
          setActiveAlternativePlanId(result.id);
          
          addPlanToHistory({
            id: result.id,
            userId: '',
            budget: activeBudget,
            ingredients: activeIngredients,
            generatedPlan: result.data.mealPlan,
            shoppingList: result.data.shoppingList,
            isSaved: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        } else {
          handlePlanGenerated(result.data, activeBudget, activeIngredients, result.id);
        }
      } else {
        if (result?.error === 'RATE_LIMIT_EXCEEDED') {
          Feedback.error.rateLimit();
        } else {
          Feedback.error.generation();
        }
      }
    } catch (error: any) {
      if (error.message === 'CLIENT_TIMEOUT') {
        Feedback.error.network();
      } else {
        Feedback.error.generation();
      }
    } finally {
      setIsRegenerating(false);
      setLoading(false);
    }
  };

  const handleRegenerateBudgetFriendly = async () => {
    if (!navigator.onLine) {
      Feedback.error.network();
      return;
    }

    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const formData = new FormData();
    formData.set('budget', activeBudget.toString());
    formData.set('ingredients', activeIngredients);
    formData.set('budgetFriendly', 'true');
    if (generatedPlan) {
      formData.set('originalEstimatedCost', generatedPlan.estimatedCost.toString());
    }

    try {
      const timeoutPromise = new Promise<{ success: false, error: string }>((_, reject) => {
        setTimeout(() => reject(new Error('CLIENT_TIMEOUT')), 60000);
      });

      const result = await Promise.race([
        generateMealPlan(formData),
        timeoutPromise
      ]) as any;
      
      if (result && result.success && result.data && result.id) {
        setAlternativePlan(result.data);
        setActiveAlternativePlanId(result.id);
        setActivePlanView('budget-friendly');
        
        addPlanToHistory({
          id: result.id,
          userId: '',
          budget: activeBudget,
          ingredients: activeIngredients,
          generatedPlan: result.data.mealPlan,
          shoppingList: result.data.shoppingList,
          isSaved: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else {
        if (result?.error === 'RATE_LIMIT_EXCEEDED') {
          Feedback.error.rateLimit();
        } else {
          Feedback.error.generation();
        }
      }
    } catch (error: any) {
      if (error.message === 'CLIENT_TIMEOUT') {
        Feedback.error.network();
      } else {
        Feedback.error.generation();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReusePlan = useCallback((plan: any) => {
    setGeneratedPlan({
      mealPlan: plan.generatedPlan,
      shoppingList: plan.shoppingList,
      estimatedCost: plan.budget,
      budgetStatus: 'WITHIN_BUDGET',
      ingredientUtilization: 'Loaded from saved history.'
    });
    setAlternativePlan(null);
    setActivePlanView('recommended');
    setActiveAlternativePlanId(null);
    setActiveBudget(plan.budget);
    setActiveIngredients(plan.ingredients);
    setActivePlanId(plan.id);
    setActiveTab('generate');
  }, [setActiveTab]);

  const handleViewOnlyPlan = useCallback((plan: any) => {
    setGeneratedPlan({
      mealPlan: plan.generatedPlan,
      shoppingList: plan.shoppingList,
      estimatedCost: plan.budget,
      budgetStatus: 'WITHIN_BUDGET',
      ingredientUtilization: 'Loaded from saved history.'
    });
    setActiveBudget(plan.budget);
    setActiveIngredients(plan.ingredients);
    setActivePlanId(plan.id);
    setActiveTab('view-plan');
  }, [setActiveTab]);

  return {
    loading, setLoading,
    isRegenerating,
    saving,
    generatedPlan,
    alternativePlan,
    activePlanView, setActivePlanView,
    activeBudget,
    activeIngredients,
    activePlanId,
    activeAlternativePlanId,
    formKey,
    handlePlanGenerated,
    handleSavePlan,
    handleRegeneratePlan,
    handleRegenerateBudgetFriendly,
    clearGeneratedPlan,
    handleReusePlan,
    handleViewOnlyPlan
  };
}

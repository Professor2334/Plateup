'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { MealPlanResponse } from '@/lib/deepseek';
import { Sparkles, Coffee, Sun, Utensils, Save, Share2, RefreshCcw, ShoppingBag, CheckCircle2, TrendingDown, PiggyBank, CalendarDays, Check } from 'lucide-react';

interface MealPlanResultsProps {
  plan: MealPlanResponse;
  budget: number;
  ingredients: string;
  onSave: () => void;
  isSaving: boolean;
  onShare: (selectedItems?: Set<number>) => void;
  onRegenerate: () => void;
  isSaved: boolean;
}

export function MealPlanResults({ 
  plan, 
  budget, 
  ingredients, 
  onSave, 
  isSaving, 
  onShare, 
  onRegenerate,
  isSaved 
}: MealPlanResultsProps) {
  
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);
  const estimatedSavings = Math.max(0, budget - plan.estimatedCost);

  const toggleItem = (idx: number) => {
    const newSet = new Set(checkedItems);
    if (newSet.has(idx)) {
      newSet.delete(idx);
    } else {
      newSet.add(idx);
    }
    setCheckedItems(newSet);
  };

  const availableIngredients = ingredients
    .split(',')
    .map(i => i.trim())
    .filter(i => i.length > 0);

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-on-surface)] tracking-tight flex items-center gap-2">
            AI Meal Plan
            <Sparkles className="w-6 h-6 text-[var(--color-primary)]" />
          </h1>
          <p className="text-[var(--color-on-surface-variant)] text-sm mt-1">Generated based on your ingredients and budget.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => onShare(checkedItems)} className="gap-2 h-10">
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <div className="relative">
            <Button variant="outline" onClick={() => setShowRegenerateConfirm(true)} className="gap-2 h-10">
              <RefreshCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Regenerate</span>
            </Button>
            
            {showRegenerateConfirm && (
              <>
                {/* Invisible overlay to catch outside clicks */}
                <div className="fixed inset-0 z-40" onClick={() => setShowRegenerateConfirm(false)} />
                <div className="absolute bottom-full mb-2 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 w-64 bg-white rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-[var(--color-outline-variant)]/30 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <p className="text-[14px] font-bold text-[var(--color-on-surface)] mb-1">Regenerate Plan?</p>
                  <p className="text-[12px] text-[var(--color-on-surface-variant)] mb-3 leading-tight">This will overwrite your current plan.</p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 h-8 text-xs" onClick={() => setShowRegenerateConfirm(false)}>Cancel</Button>
                    <Button className="flex-1 h-8 text-xs bg-[var(--color-primary)] text-white hover:bg-[color-mix(in_srgb,var(--color-primary)_85%,black)]" onClick={() => { setShowRegenerateConfirm(false); onRegenerate(); }}>Yes, regenerate</Button>
                  </div>
                </div>
              </>
            )}
          </div>
          {!isSaved && (
            <Button onClick={onSave} disabled={isSaving} className="gap-2 h-10 shadow-sm">
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Plan'}
            </Button>
          )}
        </div>
      </div>

      {/* AI Summary Card */}
      <div className="bg-[color-mix(in_srgb,var(--color-primary)_4%,transparent)] border border-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] rounded-2xl p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-[var(--color-primary)]" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[var(--color-on-surface)] mb-1">AI Optimization Strategy</h3>
            <p className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed">
              This plan maximizes your <strong>NGN {budget.toLocaleString()}</strong> budget by prioritizing affordable Nigerian staples. 
              It intelligently incorporates your available ingredients ({ingredients || 'none provided'}) to minimize additional grocery costs.
            </p>
          </div>
        </div>
      </div>

      {/* Main Layout Flow */}
      <div className="flex flex-col gap-16">
        
        {/* Section 1: Metrics & Meals */}
        <div className="w-full space-y-6 lg:space-y-8">
          
          {/* Overview Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-[var(--color-outline-variant)]/20">
              <div className="flex items-center gap-2 text-[var(--color-secondary)] mb-2">
                <CalendarDays className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Duration</span>
              </div>
              <p className="text-xl font-bold text-[var(--color-on-surface)]">7 Days</p>
            </div>
            
            <div className="bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-[var(--color-outline-variant)]/20">
              <div className="flex items-center gap-2 text-[var(--color-secondary)] mb-2">
                <Utensils className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Meals</span>
              </div>
              <p className="text-xl font-bold text-[var(--color-on-surface)]">21</p>
            </div>
            
            <div className="bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-[var(--color-outline-variant)]/20">
              <div className="flex items-center gap-2 text-[var(--color-secondary)] mb-2">
                <PiggyBank className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Estimated</span>
              </div>
              <p className="text-xl font-bold text-[var(--color-on-surface)] tracking-tight">
                ₦{plan.estimatedCost.toLocaleString()}
              </p>
            </div>
            
            <div className="bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-[color-mix(in_srgb,var(--color-primary)_15%,transparent)]">
              <div className="flex items-center gap-2 text-[var(--color-primary)] mb-2">
                <TrendingDown className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Savings</span>
              </div>
              <p className="text-xl font-bold text-[var(--color-primary)] tracking-tight">
                ₦{estimatedSavings.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Daily Meal Cards */}
          <div className="space-y-4 sm:space-y-5">
            <h2 className="text-lg font-bold text-[var(--color-on-surface)] flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-[var(--color-primary)]" />
              Weekly Menu
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              {plan.mealPlan.map((dayPlan, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[var(--color-outline-variant)]/30 group hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300">
                  <div className="flex items-center justify-between border-b border-[var(--color-outline-variant)]/30 pb-4 mb-4">
                    <h3 className="font-extrabold text-[17px] text-[var(--color-on-surface)] tracking-tight">{dayPlan.day}</h3>
                    <span className="text-[11px] font-bold px-2.5 py-1 bg-[#f9fafb] text-[var(--color-secondary)] rounded-full uppercase tracking-widest border border-[var(--color-outline-variant)]/50">
                      Day {idx + 1}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[var(--color-secondary)]">
                        <Coffee className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Breakfast</span>
                      </div>
                      <p className="text-[14px] font-medium text-[var(--color-on-surface)]">{dayPlan.breakfast}</p>
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[var(--color-secondary)]">
                        <Sun className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Lunch</span>
                      </div>
                      <p className="text-[14px] font-medium text-[var(--color-on-surface)]">{dayPlan.lunch}</p>
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[var(--color-secondary)]">
                        <Utensils className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Dinner</span>
                      </div>
                      <p className="text-[14px] font-medium text-[var(--color-on-surface)]">{dayPlan.dinner}</p>
                    </div>
                  </div>
                  
                  {/* Card Footer AI Reasoning */}
                  <div className="mt-5 pt-4 border-t border-dashed border-[var(--color-outline-variant)]/40 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] opacity-70" />
                    <p className="text-[12px] font-medium text-[var(--color-on-surface-variant)] opacity-80">
                      Budget optimized • Incorporates available ingredients
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Shopping List */}
        <div className="w-full bg-white rounded-3xl p-6 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[var(--color-outline-variant)]/30">
          
          {/* Header */}
          <div className="border-b border-[var(--color-outline-variant)]/40 pb-6 mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-[color-mix(in_srgb,var(--color-accent)_15%,transparent)] flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-[var(--color-accent)]" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-on-surface)] tracking-tight">Shopping List</h2>
                <p className="text-sm text-[var(--color-secondary)] font-medium mt-1">For {plan.mealPlan.length} Days of Meals</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left: Ingredients Lists */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Available At Home */}
              {availableIngredients.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-[var(--color-primary)]">
                    <CheckCircle2 className="w-5 h-5" />
                    Available At Home
                  </h3>
                  <div className="bg-[color-mix(in_srgb,var(--color-primary)_4%,transparent)] border border-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] rounded-xl p-5">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {availableIngredients.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm font-medium text-[var(--color-on-surface)]">
                          <Check className="w-4 h-4 text-[var(--color-primary)]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Need To Buy */}
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-[var(--color-on-surface)]">
                    <ShoppingBag className="w-5 h-5 text-[var(--color-accent)]" />
                    Need To Buy
                  </h3>
                  <div className="flex items-center gap-3 bg-[#f9fafb] px-3 py-1.5 rounded-full border border-[var(--color-outline-variant)]/30">
                    <span className="text-sm font-bold text-[var(--color-secondary)]">
                      {checkedItems.size} / {plan.shoppingList.length} Items Purchased
                    </span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-2 bg-[#f9fafb] rounded-full overflow-hidden border border-[var(--color-outline-variant)]/20">
                  <div 
                    className="h-full bg-[var(--color-primary)] transition-all duration-500 ease-out"
                    style={{ width: `${(checkedItems.size / Math.max(1, plan.shoppingList.length)) * 100}%` }}
                  />
                </div>

                <ul className="space-y-3 mt-4">
                  {plan.shoppingList.map((item, idx) => {
                    const isChecked = checkedItems.has(idx);
                    return (
                      <li 
                        key={idx} 
                        className="flex items-start gap-4 group cursor-pointer p-3 rounded-xl hover:bg-[#f9fafb] transition-colors border border-transparent hover:border-[var(--color-outline-variant)]/30"
                        onClick={() => toggleItem(idx)}
                      >
                        <div className={`mt-0.5 w-5 h-5 rounded-[6px] border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                          isChecked 
                            ? 'bg-[var(--color-primary)] border-[var(--color-primary)] shadow-sm' 
                            : 'border-[var(--color-outline-variant)] bg-white group-hover:border-[var(--color-primary)]'
                        }`}>
                          {isChecked && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <div className="flex-1 min-w-0 flex justify-between items-start">
                          <span className="text-[15px] font-semibold leading-tight pr-2 text-[var(--color-on-surface)] mt-0.5">
                            {item.item}
                          </span>
                          <span className="text-[14px] font-bold px-2.5 py-1 rounded-md whitespace-nowrap bg-white border border-[var(--color-outline-variant)]/40 text-[var(--color-secondary)] shadow-sm">
                            {item.quantity}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Right: Summary & Actions */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[color-mix(in_srgb,var(--color-primary)_4%,transparent)] border border-[color-mix(in_srgb,var(--color-primary)_15%,transparent)] rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 text-[var(--color-primary)] mb-3">
                  <PiggyBank className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-wider">Estimated Cost</span>
                </div>
                <p className="text-3xl font-extrabold text-[var(--color-primary)] tracking-tight">
                  ₦{plan.estimatedCost.toLocaleString()}
                </p>
                <p className="text-xs text-[var(--color-primary)] opacity-80 mt-2 font-medium">
                  Based on local market averages
                </p>
              </div>

              <div className="bg-[#f9fafb] rounded-2xl p-6 border border-[var(--color-outline-variant)]/30 space-y-4">
                <h4 className="font-bold text-[var(--color-on-surface)] text-sm uppercase tracking-wider">Actions</h4>
                <Button onClick={() => onShare(checkedItems)} className="w-full bg-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_85%,black)] text-white shadow-sm font-bold h-12 text-base gap-2">
                  <Share2 className="w-4 h-4" />
                  Send to WhatsApp
                </Button>
                <p className="text-xs text-[var(--color-secondary)] text-center font-medium px-2">
                  Tip: Ticking items will export only the ticked items to WhatsApp!
                </p>
              </div>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
}

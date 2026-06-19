'use client';

import { useState } from 'react';
import {
  Search,
  Bookmark,
  Trash2,
  RefreshCw,
  Calendar,
  Sparkles,
  Clock,
  ShoppingBag,
  Utensils,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import { MealPlanModel } from '@/types';

interface SavedPlansTabProps {
  history: MealPlanModel[];
  title: string;
  handleViewOnlyPlan: (plan: MealPlanModel) => void;
  handleDeletePlan: (id: string) => void;
  handleReusePlan: (plan: MealPlanModel) => void;
  handleTabChange: (tab: any) => void;
  isScrolled: boolean;
}

export function SavedPlansTab({
  history,
  title,
  handleViewOnlyPlan,
  handleDeletePlan,
  handleReusePlan,
  handleTabChange,
  isScrolled,
}: SavedPlansTabProps) {
  const [savedSearchText, setSavedSearchText] = useState('');
  const [savedFilter, setSavedFilter] = useState<'All' | 'Recent' | 'Budget Friendly'>('All');

  const debouncedSearchText = useDebounce(savedSearchText, 300);

  // ── All business logic unchanged ──────────────────────────────────────────

  const allSavedPlans = history.filter((p: MealPlanModel) => p.isSaved);

  const totalSaved = allSavedPlans.length;
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const savedThisMonth = allSavedPlans.filter((p: MealPlanModel) => {
    const d = new Date(p.createdAt);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;

  const todayStr = new Date().toDateString();
  let lastSavedStr = 'Never';
  if (allSavedPlans.length > 0) {
    const sorted = [...allSavedPlans].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const lastDate = new Date(sorted[0].createdAt);
    if (lastDate.toDateString() === todayStr) {
      lastSavedStr = 'Today';
    } else {
      lastSavedStr = lastDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  }

  let filteredPlans = allSavedPlans.filter((plan: MealPlanModel) => {
    if (savedFilter === 'Budget Friendly' && plan.budget > 15000) return false;
    if (savedFilter === 'Recent') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      if (new Date(plan.createdAt) < oneWeekAgo) return false;
    }
    if (debouncedSearchText) {
      const searchLower = debouncedSearchText.toLowerCase();
      if (
        !plan.ingredients.toLowerCase().includes(searchLower) &&
        !plan.budget.toString().includes(searchLower)
      ) {
        return false;
      }
    }
    return true;
  });

  filteredPlans.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="-mx-4 lg:-mx-14 bg-white px-4 lg:px-14 pb-12 relative">
      {/* ── STICKY HEADER — fixed height only, never changes size ── */}
      <div
        className={`sticky top-[-24px] lg:top-[-32px] z-40 -mx-4 px-4 lg:-mx-14 lg:px-14 pt-6 lg:pt-8 pb-4 mb-6 transition-all duration-500 ease-in-out ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.02)]'
            : 'bg-white'
        }`}
      >
        <div className="max-w-5xl">
          {/* Title row */}
          <div className="flex items-center justify-between mb-4">
            <h2
              className={`font-bold text-[var(--color-on-surface)] tracking-tight transition-[font-size] duration-300 ease-out ${
                isScrolled
                  ? 'text-[clamp(1.125rem,2vw,1.25rem)]'
                  : 'text-[clamp(1.5rem,3vw+0.5rem,1.875rem)]'
              }`}
            >
              {title}
            </h2>
          </div>

          {/* Search + filter — only shown when plans exist */}
          {allSavedPlans.length > 0 && (
            <div className="flex flex-col gap-3">
              {/* Full-width search */}
              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-[var(--color-on-surface-variant)] opacity-50" />
                </div>
                <input
                  type="search"
                  placeholder="Search by ingredient or budget..."
                  value={savedSearchText}
                  onChange={(e) => setSavedSearchText(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white border border-[var(--color-outline-variant)]/30 focus:border-[var(--color-primary)]/50 focus:ring-2 focus:ring-[var(--color-primary)]/10 text-sm transition-all outline-none shadow-sm"
                />
              </div>

              {/* Filter buttons */}
              <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
                {(['All', 'Recent', 'Budget Friendly'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSavedFilter(filter)}
                    className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap min-h-[44px] ${
                      savedFilter === filter
                        ? 'bg-[var(--color-primary)] text-white shadow-sm'
                        : 'bg-white text-[var(--color-on-surface-variant)] border border-[var(--color-outline-variant)]/30 hover:text-[var(--color-on-surface)]'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── SUBTITLE & STATS — opacity-only fade (no layout change = no scroll feedback loop) ── */}
      <div
        className={`max-w-5xl mb-6 transition-opacity duration-300 ease-out ${
          isScrolled ? 'opacity-0 pointer-events-none select-none' : 'opacity-100'
        }`}
      >
        <p className="text-sm text-[var(--color-on-surface-variant)] mb-4">
          Manage and reuse your previously saved meal plans.
        </p>
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-[var(--color-outline-variant)]/30 shadow-sm">
            <Bookmark className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span className="text-xs font-bold text-[var(--color-on-surface)]">{totalSaved}</span>
            <span className="text-xs font-medium text-[var(--color-on-surface-variant)]">Saved Plans</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-[var(--color-outline-variant)]/30 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span className="text-xs font-bold text-[var(--color-on-surface)]">{savedThisMonth}</span>
            <span className="text-xs font-medium text-[var(--color-on-surface-variant)]">This Month</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-[var(--color-outline-variant)]/30 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span className="text-xs font-medium text-[var(--color-on-surface-variant)]">Last saved:</span>
            <span className="text-xs font-bold text-[var(--color-on-surface)]">{lastSavedStr}</span>
          </div>
        </div>
      </div>


      {/* ── CONTENT AREA ── */}
      <div className="max-w-5xl">
        {allSavedPlans.length === 0 ? (
          /* ── EMPTY STATE ── */
          <div className="py-16 flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 rounded-full bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] flex items-center justify-center mb-6">
              <Bookmark
                className="w-10 h-10 text-[var(--color-primary)] opacity-60"
                strokeWidth={1.5}
              />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-on-surface)] mb-2">
              You haven’t saved any meal plans yet.
            </h3>
            <p className="text-sm text-[var(--color-on-surface-variant)] max-w-xs leading-relaxed mb-8">
              Generate a Nigerian meal plan and tap Save to keep it here for future reference and reuse.
            </p>
            <Button
              onClick={() => handleTabChange('generate')}
              className="h-12 px-8 font-bold rounded-xl shadow-sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Meal Plan
            </Button>
          </div>
        ) : filteredPlans.length === 0 ? (
          /* ── NO RESULTS ── */
          <div className="py-16 flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 rounded-full bg-[#f9fafb] flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-[var(--color-on-surface-variant)] opacity-40" />
            </div>
            <p className="text-base font-bold text-[var(--color-on-surface)] mb-1">
              No results found
            </p>
            <p className="text-sm text-[var(--color-on-surface-variant)]">
              Try adjusting your search or filter.
            </p>
          </div>
        ) : (
          /* ── CARD GRID ── */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPlans.map((plan: MealPlanModel) => {
              const planDate = new Date(plan.createdAt);
              const dateString = planDate.toLocaleDateString('en-NG', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              const ingredientList = plan.ingredients
                .split(',')
                .map((i: string) => i.trim())
                .filter((i: string) => i.length > 0);

              return (
                <div
                  key={plan.id}
                  className="bg-white rounded-2xl border border-[var(--color-outline-variant)]/20 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-shadow overflow-hidden flex flex-col"
                >
                  {/* Top accent: green for saved */}
                  <div className="h-1 w-full bg-[var(--color-primary)]" />

                  <div className="p-5 flex flex-col flex-grow">
                    {/* ── Card header: title + saved badge ── */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[0.9375rem] font-extrabold text-[var(--color-on-surface)] tracking-tight leading-snug">
                          Saved Meal Plan
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Clock className="w-3 h-3 text-[var(--color-on-surface-variant)] opacity-50 flex-shrink-0" />
                          <span className="text-[0.75rem] font-medium text-[var(--color-on-surface-variant)] truncate">
                            {dateString}
                          </span>
                        </div>
                      </div>

                      {/* Saved badge */}
                      <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.6875rem] font-bold bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] text-[var(--color-primary)]">
                        <Bookmark className="w-3 h-3 fill-current" />
                        Saved
                      </span>
                    </div>

                    {/* ── Budget ── */}
                    <div className="mb-4">
                      <p className="text-[0.6875rem] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1">
                        Budget
                      </p>
                      <p className="text-[1.0625rem] font-extrabold text-[var(--color-on-surface)]">
                        ₦{plan.budget.toLocaleString()}
                      </p>
                    </div>

                    {/* ── Meta chips ── */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="inline-flex items-center gap-1.5 bg-[#f9fafb] border border-[var(--color-outline-variant)]/20 rounded-lg px-2.5 py-1.5">
                        <Calendar className="w-3 h-3 text-[var(--color-secondary)]" />
                        <span className="text-[0.6875rem] font-bold text-[var(--color-secondary)]">
                          7 Days
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 bg-[#f9fafb] border border-[var(--color-outline-variant)]/20 rounded-lg px-2.5 py-1.5">
                        <Utensils className="w-3 h-3 text-[var(--color-secondary)]" />
                        <span className="text-[0.6875rem] font-bold text-[var(--color-secondary)]">
                          21 Meals
                        </span>
                      </div>
                      {ingredientList.length > 0 && (
                        <div className="inline-flex items-center gap-1.5 bg-[#f9fafb] border border-[var(--color-outline-variant)]/20 rounded-lg px-2.5 py-1.5">
                          <ShoppingBag className="w-3 h-3 text-[var(--color-secondary)]" />
                          <span className="text-[0.6875rem] font-bold text-[var(--color-secondary)]">
                            {ingredientList.length} Ingredient
                            {ingredientList.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ── Ingredients preview ── */}
                    {ingredientList.length > 0 && (
                      <p
                        className="text-[0.8125rem] text-[var(--color-on-surface-variant)] leading-relaxed line-clamp-2 mb-5 flex-grow"
                        title={ingredientList.join(', ')}
                      >
                        {ingredientList.join(' · ')}
                      </p>
                    )}

                    {/* ── Action buttons ── */}
                    <div className="mt-auto pt-4 border-t border-[var(--color-outline-variant)]/15 flex flex-col gap-2">
                      <button
                        onClick={() => handleReusePlan(plan)}
                        className="w-full inline-flex items-center justify-center gap-2 h-11 px-3 rounded-xl bg-[var(--color-primary)] text-white text-[0.8125rem] font-bold transition-all hover:opacity-90 active:scale-[0.98]"
                        aria-label="Reuse this meal plan"
                      >
                        <RefreshCw className="w-3.5 h-3.5 flex-shrink-0" />
                        Reuse Plan
                      </button>

                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="w-full inline-flex items-center justify-center gap-2 h-10 px-3 rounded-xl bg-[color-mix(in_srgb,var(--color-error)_6%,transparent)] text-[var(--color-error)] border border-[color-mix(in_srgb,var(--color-error)_15%,transparent)] text-[0.8125rem] font-bold transition-all hover:bg-[color-mix(in_srgb,var(--color-error)_12%,transparent)] active:scale-[0.98]"
                        aria-label="Delete this meal plan"
                      >
                        <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />
                        Delete Plan
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

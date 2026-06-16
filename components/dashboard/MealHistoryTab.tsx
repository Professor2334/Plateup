'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Utensils, Calendar, Bookmark, Trash2, Eye, Clock, ShoppingBag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import { MealPlanModel } from '@/types';

interface MealHistoryTabProps {
  history: MealPlanModel[];
  handleClearAllHistory: () => void;
  handleViewOnlyPlan: (plan: MealPlanModel) => void;
  handleSavePlanById: (id: string) => void;
  handleDeletePlan: (id: string) => void;
  handleTabChange: (tab: any) => void;
  isScrolled: boolean;
}

export function MealHistoryTab({
  history,
  handleClearAllHistory,
  handleViewOnlyPlan,
  handleSavePlanById,
  handleDeletePlan,
  handleTabChange,
  isScrolled,
}: MealHistoryTabProps) {
  const [historySearchText, setHistorySearchText] = useState('');
  const [historyFilter, setHistoryFilter] = useState<'All' | 'Saved' | 'Unsaved'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const debouncedSearchText = useDebounce(historySearchText, 300);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchText, historyFilter]);

  // 1. Filter history (unchanged logic)
  const filteredHistory = history.filter((plan: MealPlanModel) => {
    if (historyFilter === 'Saved' && !plan.isSaved) return false;
    if (historyFilter === 'Unsaved' && plan.isSaved) return false;
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

  // 2. Group history by date (unchanged logic)
  const groups: Record<string, MealPlanModel[]> = {
    'TODAY': [],
    'EARLIER THIS WEEK': [],
    'LAST WEEK': [],
    'OLDER': [],
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const earlierThisWeek = new Date(today);
  earlierThisWeek.setDate(earlierThisWeek.getDate() - 3);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const totalItems = filteredHistory.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHistory = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

  paginatedHistory.forEach((plan: MealPlanModel) => {
    const d = new Date(plan.createdAt);
    if (d >= today) {
      groups['TODAY'].push(plan);
    } else if (d >= earlierThisWeek && d < today) {
      groups['EARLIER THIS WEEK'].push(plan);
    } else if (d >= lastWeek && d < earlierThisWeek) {
      groups['LAST WEEK'].push(plan);
    } else {
      groups['OLDER'].push(plan);
    }
  });

  const totalGenerated = history.length;
  const totalSaved = history.filter((p) => p.isSaved).length;
  const thisWeekGenerated = history.filter(
    (p: MealPlanModel) => new Date(p.createdAt) >= lastWeek
  ).length;

  return (
    <div className="pb-12 relative w-full">
      {/* ── STICKY HEADER ── */}
      <div
        className={`sticky top-[-24px] lg:top-[-32px] z-40 -mx-4 px-4 lg:-mx-14 lg:px-14 pt-6 lg:pt-8 pb-4 mb-6 transition-all duration-500 ease-in-out ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.02)]'
            : 'bg-[#f9fafb]'
        }`}
      >
        <div className="max-w-5xl">
          {/* Title row */}
          <div className="flex items-center justify-between mb-4">
            <h2
              className={`font-bold text-[var(--color-on-surface)] tracking-tight transition-all duration-500 ease-in-out origin-left ${
                isScrolled
                  ? 'text-[clamp(1.125rem,2vw,1.25rem)] scale-95'
                  : 'text-[clamp(1.5rem,3vw+0.5rem,1.875rem)] scale-100'
              }`}
            >
              Meal History
            </h2>
            {history.length > 0 && (
              <button
                onClick={handleClearAllHistory}
                className="text-sm font-bold text-[var(--color-error)] hover:bg-[var(--color-error)]/10 px-4 py-2 rounded-full transition-all min-h-[40px]"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Stats row — collapses on scroll */}
          <div
            className={`grid transition-all duration-500 ease-in-out ${
              isScrolled ? 'grid-rows-[0fr] opacity-0 mb-0' : 'grid-rows-[1fr] opacity-100 mb-5'
            }`}
          >
            <div className="overflow-hidden">
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-4">
                A history of all your generated meal plans.
              </p>

              {/* Mobile-friendly stat chips */}
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-[var(--color-outline-variant)]/30 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  <span className="text-xs font-bold text-[var(--color-on-surface)]">
                    {totalGenerated}
                  </span>
                  <span className="text-xs font-medium text-[var(--color-on-surface-variant)]">
                    Generated
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-[var(--color-outline-variant)]/30 shadow-sm">
                  <Bookmark className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  <span className="text-xs font-bold text-[var(--color-on-surface)]">
                    {totalSaved}
                  </span>
                  <span className="text-xs font-medium text-[var(--color-on-surface-variant)]">
                    Saved
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-[var(--color-outline-variant)]/30 shadow-sm">
                  <Calendar className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  <span className="text-xs font-bold text-[var(--color-on-surface)]">
                    {thisWeekGenerated}
                  </span>
                  <span className="text-xs font-medium text-[var(--color-on-surface-variant)]">
                    This Week
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filter — only shown when there's history */}
          {history.length > 0 && (
            <div className="flex flex-col gap-3">
              {/* Full-width search input */}
              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-[var(--color-on-surface-variant)] opacity-50" />
                </div>
                <input
                  type="search"
                  placeholder="Search by ingredient or budget..."
                  value={historySearchText}
                  onChange={(e) => setHistorySearchText(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white border border-[var(--color-outline-variant)]/30 focus:border-[var(--color-primary)]/50 focus:ring-2 focus:ring-[var(--color-primary)]/10 text-sm transition-all outline-none shadow-sm"
                />
              </div>

              {/* Filter: full-width segmented control on mobile */}
              <div className="grid grid-cols-3 bg-white p-1 rounded-2xl border border-[var(--color-outline-variant)]/30 shadow-sm">
                {(['All', 'Saved', 'Unsaved'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setHistoryFilter(filter)}
                    className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                      historyFilter === filter
                        ? 'bg-[var(--color-primary)] text-white shadow-sm'
                        : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
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

      {/* ── CONTENT AREA ── */}
      <div className="max-w-5xl">
        {history.length === 0 ? (
          /* ── EMPTY STATE ── */
          <div className="py-16 flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 rounded-full bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] flex items-center justify-center mb-6">
              <Utensils className="w-10 h-10 text-[var(--color-primary)] opacity-60" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-on-surface)] mb-2">
              No meal plans yet
            </h3>
            <p className="text-sm text-[var(--color-on-surface-variant)] max-w-xs leading-relaxed mb-8">
              Generate your first Nigerian meal plan to start building your history. It takes under 60 seconds.
            </p>
            <Button
              onClick={() => handleTabChange('generate')}
              className="h-12 px-8 font-bold rounded-xl shadow-sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate My First Meal Plan
            </Button>
          </div>
        ) : filteredHistory.length === 0 ? (
          /* ── NO RESULTS ── */
          <div className="py-16 flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 rounded-full bg-[#f9fafb] flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-[var(--color-on-surface-variant)] opacity-40" />
            </div>
            <p className="text-base font-bold text-[var(--color-on-surface)] mb-1">No results found</p>
            <p className="text-sm text-[var(--color-on-surface-variant)]">
              Try adjusting your search or filter.
            </p>
          </div>
        ) : (
          /* ── CARD GROUPS ── */
          <>
            <div className="space-y-6">
              {Object.entries(groups).map(([groupName, plans]) => {
                if (plans.length === 0) return null;
                return (
                  <div key={groupName}>
                    {/* Group label */}
                    <p className="text-[0.6875rem] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest mb-3 px-1">
                      {groupName}
                    </p>

                    {/* Card grid — 1 col mobile, 2 col md+ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {plans.map((plan: MealPlanModel) => {
                        const planDate = new Date(plan.createdAt);
                        const time = planDate.toLocaleTimeString('en-NG', {
                          hour: 'numeric',
                          minute: '2-digit',
                        });
                        const dateString = planDate.toLocaleDateString('en-NG', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        });

                        const ingredientList = plan.ingredients
                          .split(',')
                          .map((i: string) => i.trim())
                          .filter((i: string) => i.length > 0);

                        const shoppingList = Array.isArray(plan.shoppingList)
                          ? (plan.shoppingList as unknown[]).length
                          : 0;

                        return (
                          <div
                            key={plan.id}
                            className="bg-white rounded-2xl border border-[var(--color-outline-variant)]/20 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-shadow overflow-hidden"
                          >
                            {/* Card top accent strip by save state */}
                            <div
                              className={`h-1 w-full ${
                                plan.isSaved
                                  ? 'bg-[var(--color-primary)]'
                                  : 'bg-[var(--color-outline-variant)]/40'
                              }`}
                            />

                            <div className="p-5">
                              {/* Header row: title + save badge */}
                              <div className="flex items-start justify-between gap-3 mb-4">
                                <div>
                                  <h4 className="text-[0.9375rem] font-extrabold text-[var(--color-on-surface)] tracking-tight leading-snug">
                                    Generated Meal Plan
                                  </h4>
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <Clock className="w-3 h-3 text-[var(--color-on-surface-variant)] opacity-50" />
                                    <span className="text-[0.75rem] font-medium text-[var(--color-on-surface-variant)]">
                                      {dateString} · {time}
                                    </span>
                                  </div>
                                </div>

                                {/* Save status badge */}
                                <span
                                  className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.6875rem] font-bold ${
                                    plan.isSaved
                                      ? 'bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] text-[var(--color-primary)]'
                                      : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      plan.isSaved ? 'bg-[var(--color-primary)]' : 'bg-yellow-400'
                                    }`}
                                  />
                                  {plan.isSaved ? 'Saved' : 'Unsaved'}
                                </span>
                              </div>

                              {/* Budget */}
                              <div className="mb-4">
                                <p className="text-[0.75rem] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1">
                                  Budget
                                </p>
                                <p className="text-[1rem] font-extrabold text-[var(--color-on-surface)]">
                                  ₦{plan.budget.toLocaleString()}
                                </p>
                              </div>

                              {/* Meta chips row */}
                              <div className="flex flex-wrap gap-2 mb-5">
                                <div className="inline-flex items-center gap-1.5 bg-[#f9fafb] border border-[var(--color-outline-variant)]/20 rounded-lg px-2.5 py-1.5">
                                  <Calendar className="w-3 h-3 text-[var(--color-secondary)]" />
                                  <span className="text-[0.6875rem] font-bold text-[var(--color-secondary)]">7 Days</span>
                                </div>
                                <div className="inline-flex items-center gap-1.5 bg-[#f9fafb] border border-[var(--color-outline-variant)]/20 rounded-lg px-2.5 py-1.5">
                                  <Utensils className="w-3 h-3 text-[var(--color-secondary)]" />
                                  <span className="text-[0.6875rem] font-bold text-[var(--color-secondary)]">21 Meals</span>
                                </div>
                                {ingredientList.length > 0 && (
                                  <div className="inline-flex items-center gap-1.5 bg-[#f9fafb] border border-[var(--color-outline-variant)]/20 rounded-lg px-2.5 py-1.5">
                                    <ShoppingBag className="w-3 h-3 text-[var(--color-secondary)]" />
                                    <span className="text-[0.6875rem] font-bold text-[var(--color-secondary)]">
                                      {ingredientList.length} Ingredient{ingredientList.length !== 1 ? 's' : ''}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Ingredients preview — truncated, accessible */}
                              {ingredientList.length > 0 && (
                                <p
                                  className="text-[0.8125rem] text-[var(--color-on-surface-variant)] leading-relaxed mb-5 line-clamp-2"
                                  title={ingredientList.join(', ')}
                                >
                                  {ingredientList.join(' · ')}
                                </p>
                              )}

                              {/* Actions — full-width tap targets on mobile */}
                              <div className="flex gap-2 pt-4 border-t border-[var(--color-outline-variant)]/15">
                                {/* PRIMARY: View Plan */}
                                <button
                                  onClick={() => handleViewOnlyPlan(plan)}
                                  className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-[var(--color-primary)] text-white text-[0.8125rem] font-bold transition-all hover:opacity-90 active:scale-[0.98]"
                                  aria-label={`View meal plan from ${dateString}`}
                                >
                                  <Eye className="w-4 h-4 flex-shrink-0" />
                                  View Plan
                                </button>

                                {/* SECONDARY: Save (only if unsaved) */}
                                {!plan.isSaved && (
                                  <button
                                    onClick={() => handleSavePlanById(plan.id)}
                                    className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] text-[var(--color-primary)] text-[0.8125rem] font-bold border border-[color-mix(in_srgb,var(--color-primary)_20%,transparent)] transition-all hover:bg-[color-mix(in_srgb,var(--color-primary)_15%,transparent)] active:scale-[0.98]"
                                    aria-label="Save this meal plan"
                                  >
                                    <Bookmark className="w-4 h-4 flex-shrink-0" />
                                    Save
                                  </button>
                                )}

                                {/* DESTRUCTIVE: Delete */}
                                <button
                                  onClick={() => handleDeletePlan(plan.id)}
                                  className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] text-[var(--color-error)] border border-[color-mix(in_srgb,var(--color-error)_15%,transparent)] transition-all hover:bg-[color-mix(in_srgb,var(--color-error)_15%,transparent)] active:scale-[0.98] flex-shrink-0"
                                  aria-label="Delete this meal plan"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── PAGINATION ── */}
            {totalPages > 1 && (
              <div className="mt-8 border-t border-[var(--color-outline-variant)]/10 pt-6">
                {/* Page info */}
                <p className="text-xs text-center text-[var(--color-on-surface-variant)] mb-4">
                  Showing{' '}
                  <span className="font-bold text-[var(--color-on-surface)]">{startIndex + 1}</span>
                  {' – '}
                  <span className="font-bold text-[var(--color-on-surface)]">
                    {Math.min(startIndex + itemsPerPage, totalItems)}
                  </span>{' '}
                  of{' '}
                  <span className="font-bold text-[var(--color-on-surface)]">{totalItems}</span>{' '}
                  results
                </p>

                {/* Prev / page dots / Next — full width on mobile */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex-1 h-11 rounded-xl text-sm font-bold border-[var(--color-outline-variant)]/30"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  <span className="px-3 py-2 text-xs font-bold text-[var(--color-on-surface-variant)] bg-white rounded-xl border border-[var(--color-outline-variant)]/20 whitespace-nowrap flex-shrink-0">
                    {currentPage} / {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex-1 h-11 rounded-xl text-sm font-bold border-[var(--color-outline-variant)]/30"
                    aria-label="Next page"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

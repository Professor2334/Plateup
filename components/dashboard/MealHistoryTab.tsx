'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import { MealPlanModel } from '@/types';

interface MealHistoryTabProps {
  history: MealPlanModel[];
  handleClearAllHistory: () => void;
  handleSavePlanById: (id: string) => void;
  handleDeletePlan: (id: string) => void;
  handleTabChange: (tab: any) => void;
  isScrolled: boolean;
}

export function MealHistoryTab({
  history,
  handleClearAllHistory,
  handleSavePlanById,
  handleDeletePlan,
  handleTabChange,
  isScrolled
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

  // 1. Filter history
  const filteredHistory = history.filter((plan: MealPlanModel) => {
    if (historyFilter === 'Saved' && !plan.isSaved) return false;
    if (historyFilter === 'Unsaved' && plan.isSaved) return false;
    if (debouncedSearchText) {
      const searchLower = debouncedSearchText.toLowerCase();
      const dateStr = new Date(plan.createdAt).toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric'
      }).toLowerCase();
      if (
        !plan.ingredients.toLowerCase().includes(searchLower) &&
        !plan.budget.toString().includes(searchLower) &&
        !dateStr.includes(searchLower)
      ) {
        return false;
      }
    }
    return true;
  });

  // 2. Group history by date
  const groups: Record<string, MealPlanModel[]> = {
    'TODAY': [],
    'EARLIER THIS WEEK': [],
    'LAST WEEK': [],
    'OLDER': []
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
  const totalSaved = history.filter(p => p.isSaved).length;
  const thisWeekGenerated = history.filter((p: MealPlanModel) => new Date(p.createdAt) >= lastWeek).length;

  return (
    <div className="pb-12 relative w-full">
      {/* Sticky header — fixed height only, never changes size */}
      <div className={`sticky top-0 z-40 -mx-4 px-4 lg:-mx-14 lg:px-14 pt-5 pb-4 mb-2 transition-[background-color,backdrop-filter,box-shadow] duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.06)]' : 'bg-[#f9fafb]'}`}>
        <div className="max-w-5xl">
          <div className="flex flex-col">
            {/* Title + Clear All */}
            <div className="flex items-center justify-between mb-4">
              <h2 className={`font-bold text-[var(--color-on-surface)] tracking-tight transition-[font-size] duration-300 ease-out ${isScrolled ? 'text-[clamp(1.125rem,2vw,1.25rem)]' : 'text-[clamp(1.5rem,3vw+0.5rem,1.875rem)]'}`}>
                Meal History
              </h2>
              {history.length > 0 && (
                <button
                  onClick={handleClearAllHistory}
                  className="text-sm font-bold text-[var(--color-error)] hover:bg-[var(--color-error)]/10 px-4 py-2 rounded-full transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Search & Filter */}
            {history.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 flex items-center">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-[var(--color-on-surface-variant)] opacity-50 mt-[1px]" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by ingredient, budget, or date..."
                    value={historySearchText}
                    onChange={(e) => setHistorySearchText(e.target.value)}
                    className="w-full h-11 pl-12 pr-4 rounded-full bg-white sm:bg-[#f9fafb] border border-[var(--color-outline-variant)]/30 focus:bg-white focus:border-[var(--color-primary)]/50 focus:ring-1 focus:ring-[var(--color-primary)]/20 text-sm transition-all outline-none"
                  />
                </div>
                <div className="flex bg-white sm:bg-[#f9fafb] p-1 rounded-full border border-[var(--color-outline-variant)]/30 self-start">
                  {(['All', 'Saved', 'Unsaved'] as const).map(filter => (
                    <button
                      key={filter}
                      onClick={() => setHistoryFilter(filter)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${historyFilter === filter ? 'bg-white text-[var(--color-primary)] shadow-sm border border-[var(--color-outline-variant)]/20' : 'text-[var(--color-secondary)] hover:text-[var(--color-on-surface)]'}`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subtitle & stats — opacity-only fade (no layout change = no scroll feedback loop) */}
      <div className={`max-w-5xl mb-5 transition-opacity duration-300 ease-out ${isScrolled ? 'opacity-0 pointer-events-none select-none' : 'opacity-100'}`}>
        <p className="text-sm text-[var(--color-on-surface-variant)] mb-2">Track every meal plan you've generated.</p>
        <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-[var(--color-on-surface-variant)]">
          <span>{totalGenerated} Generated</span>
          <span className="opacity-40">•</span>
          <span>{totalSaved} Saved</span>
          <span className="opacity-40">•</span>
          <span>{thisWeekGenerated} This Week</span>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="max-w-5xl">
        {history.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-bold text-[var(--color-on-surface)]">No meal plans yet</h3>
            <p className="text-sm text-[var(--color-on-surface-variant)] mt-2 max-w-sm">Generate your first meal plan to start building your history.</p>
            <Button className="mt-6 font-bold" onClick={() => handleTabChange('generate')}>Generate Meal Plan</Button>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="py-20 text-center text-[var(--color-on-surface-variant)] text-sm">
            No meal plans match your current filters.
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {Object.entries(groups).map(([groupName, plans]) => {
                if (plans.length === 0) return null;
                return (
                  <div key={groupName} className="relative bg-white rounded-[20px] px-6 pt-5 pb-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                    <h3 className="text-[0.6rem] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest mb-5 ml-5">{groupName}</h3>

                    <div className="relative">
                      {/* Vertical Timeline Spine — connects all dots */}
                      <div className="absolute left-[3px] top-3 bottom-3 w-px bg-[var(--color-outline-variant)]/40" />

                      {plans.map((plan: MealPlanModel, idx: number) => {
                        const planDate = new Date(plan.createdAt);
                        const compactDate = planDate.toLocaleDateString('en-US', { weekday: 'short' });
                        const time = planDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

                        return (
                          <div
                            key={plan.id}
                            className={`group relative flex flex-col md:flex-row py-4 pl-7 pr-3 rounded-xl hover:bg-[#f9fafb] transition-colors gap-4 ${idx < plans.length - 1 ? 'mb-1' : ''}`}
                          >
                            {/* Timeline Dot */}
                            <div className="absolute left-0 top-[22px] w-[8px] h-[8px] rounded-full bg-[var(--color-outline-variant)]/60 border-2 border-white group-hover:bg-[var(--color-primary)] transition-all duration-200 z-10 shadow-sm" />

                            {/* Left Section (Content) */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3 mb-1.5">
                                <h4 className="text-[0.9375rem] font-bold text-[var(--color-on-surface)] tracking-tight leading-tight">
                                  Generated Meal Plan
                                </h4>
                              </div>

                              <div className="space-y-1 mb-3">
                                <p className="text-[0.8125rem] font-semibold text-[var(--color-on-surface)]">
                                  Budget: NGN {plan.budget.toLocaleString()}
                                </p>
                                <p className="text-[0.75rem] text-[var(--color-secondary)] leading-relaxed line-clamp-1">
                                  {plan.ingredients.split(',').map((i: string) => i.trim()).filter((i: string) => i).join(' • ')}
                                </p>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2 sm:opacity-40 sm:group-hover:opacity-100 transition-opacity">
                                {!plan.isSaved && (
                                  <button
                                    onClick={() => handleSavePlanById(plan.id)}
                                    className="text-[0.7rem] font-bold text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors px-3 py-1 rounded-md bg-[#f9fafb] border border-[var(--color-outline-variant)]/30 hover:border-[var(--color-primary)]/30"
                                  >
                                    Save Plan
                                  </button>
                                )}
                                {/* Trash icon delete */}
                                <button
                                  onClick={() => handleDeletePlan(plan.id)}
                                  title="Delete"
                                  className="p-1.5 rounded-md text-[var(--color-on-surface-variant)]/40 hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/8 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Right Section — compact metadata */}
                            <div className="md:w-40 flex flex-col items-start md:items-end text-left md:text-right gap-1.5 shrink-0 pt-0.5">
                              {/* Status badge */}
                              {plan.isSaved ? (
                                <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/8 border border-[var(--color-primary)]/20 px-2 py-0.5 rounded-full">
                                  <Check className="w-2.5 h-2.5" strokeWidth={3} />
                                  Saved
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold text-[var(--color-secondary)] bg-[var(--color-outline-variant)]/20 border border-[var(--color-outline-variant)]/30 px-2 py-0.5 rounded-full">
                                  Unsaved
                                </span>
                              )}

                              {/* Compact date + time */}
                              <div className="text-[0.75rem] font-semibold text-[var(--color-on-surface-variant)]">
                                {compactDate}, {time}
                              </div>

                              {/* Compact 7 Days • 21 Meals */}
                              <div className="text-[0.7rem] font-medium text-[var(--color-secondary)]">
                                7 Days&nbsp;•&nbsp;21 Meals
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 border-t border-[var(--color-outline-variant)]/10 pt-5">
                  <p className="text-sm text-[var(--color-on-surface-variant)] hidden sm:block">
                    Showing <span className="font-medium text-[var(--color-on-surface)]">{startIndex + 1}</span> to <span className="font-medium text-[var(--color-on-surface)]">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of <span className="font-medium text-[var(--color-on-surface)]">{totalItems}</span> results
                  </p>
                  <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-start">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="text-xs h-9 px-3 border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)]"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                    </Button>
                    <div className="sm:hidden text-sm text-[var(--color-on-surface-variant)] flex items-center">
                      Page {currentPage} of {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="text-xs h-9 px-3 border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)]"
                    >
                      Next <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

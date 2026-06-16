import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
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
      if (
        !plan.ingredients.toLowerCase().includes(searchLower) &&
        !plan.budget.toString().includes(searchLower)
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
      {/* Full-width sticky header container */}
      <div className={`sticky top-[-24px] lg:top-[-32px] z-40 -mx-4 px-4 lg:-mx-14 lg:px-14 pt-6 lg:pt-8 pb-4 mb-6 transition-all duration-500 ease-in-out ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.02)]' : 'bg-[#f9fafb]'}`}>
        <div className="max-w-5xl">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className={`font-bold text-[var(--color-on-surface)] tracking-tight transition-all duration-500 ease-in-out origin-left ${isScrolled ? 'text-[clamp(1.125rem,2vw,1.25rem)] scale-95' : 'text-[clamp(1.5rem,3vw+0.5rem,1.875rem)] scale-100'}`}>Meal History</h2>
              {history.length > 0 && (
                <button
                  onClick={handleClearAllHistory}
                  className={`text-sm font-bold text-[var(--color-error)] hover:bg-[var(--color-error)]/10 px-4 py-2 rounded-full transition-all duration-500 ${isScrolled ? 'scale-95' : 'scale-100'}`}
                >
                  Clear All
                </button>
              )}
            </div>
            
            {/* Perfectly smooth collapse using CSS Grid */}
            <div className={`grid transition-all duration-500 ease-in-out ${isScrolled ? 'grid-rows-[0fr] opacity-0 mb-0' : 'grid-rows-[1fr] opacity-100 mt-2 mb-6'}`}>
              <div className="overflow-hidden">
                <p className="text-sm text-[var(--color-on-surface-variant)]">A timeline of all your generated meal plans.</p>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-medium text-[var(--color-on-surface-variant)]">
                  <span>{totalGenerated} Plans Generated</span>
                  <span className="opacity-50">•</span>
                  <span>{totalSaved} Saved</span>
                  <span className="opacity-50">•</span>
                  <span>{thisWeekGenerated} This Week</span>
                </div>
              </div>
            </div>

            {/* Search & Filter */}
            {history.length > 0 && (
              <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-500 ease-in-out ${isScrolled ? 'mt-3' : ''}`}>
                <div className="relative flex-1 flex items-center">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-[var(--color-on-surface-variant)] opacity-50 mt-[1px]" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search meal plans..." 
                    value={historySearchText}
                    onChange={(e) => setHistorySearchText(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 rounded-full bg-white sm:bg-[#f9fafb] border border-[var(--color-outline-variant)]/30 focus:bg-white focus:border-[var(--color-primary)]/50 focus:ring-1 focus:ring-[var(--color-primary)]/20 text-sm transition-all outline-none"
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
          <div className="space-y-8">
          {Object.entries(groups).map(([groupName, plans]) => {
            if (plans.length === 0) return null;
            return (
              <div key={groupName} className="relative bg-white rounded-[24px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <h3 className="text-[0.6875rem] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest mb-6 ml-6">{groupName}</h3>
                <div className="space-y-0 relative">
                  {/* Vertical Timeline Spine */}
                  <div className="absolute left-2 top-2 bottom-4 w-px bg-[var(--color-outline-variant)]/30"></div>
                  
                  {plans.map((plan: MealPlanModel) => {
                    const planDate = new Date(plan.createdAt);
                    const time = planDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                    const dateString = planDate.toLocaleDateString('en-US', { weekday: 'long' });
                    
                    return (
                      <div key={plan.id} className="group relative flex flex-col md:flex-row py-6 px-6 ml-6 rounded-2xl hover:bg-[#f9fafb] transition-colors gap-6 border border-transparent hover:border-[var(--color-outline-variant)]/10">
                        {/* Timeline Dot */}
                        <div className="absolute -left-[27px] top-[30px] w-[12px] h-[12px] rounded-full bg-[var(--color-outline-variant)] border-2 border-white group-hover:bg-[var(--color-primary)] group-hover:scale-125 transition-all duration-300 z-10 shadow-sm"></div>
                        
                        {/* Left Section (Content) */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[1rem] font-extrabold text-[var(--color-on-surface)] tracking-tight mb-2">Generated Meal Plan</h4>
                          
                          <div className="space-y-1.5 mb-5">
                            <p className="text-[0.875rem] font-semibold text-[var(--color-on-surface)]">
                              Budget: NGN {plan.budget.toLocaleString()}
                            </p>
                            <p className="text-[0.8125rem] font-medium text-[var(--color-secondary)]">
                              Ingredients: {plan.ingredients.split(',').map((i: string) => i.trim()).filter((i: string) => i).join(' • ')}
                            </p>
                          </div>

                          {/* Actions - visible under entry */}
                          <div className="flex flex-wrap gap-3 sm:opacity-40 sm:group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleViewOnlyPlan(plan)} className="text-[0.75rem] font-bold text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors px-3 py-1.5 rounded-md bg-white border border-[var(--color-outline-variant)]/30 hover:border-[var(--color-primary)]/30 shadow-sm">View Plan</button>
                            {!plan.isSaved && (
                              <button onClick={() => handleSavePlanById(plan.id)} className="text-[0.75rem] font-bold text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors px-3 py-1.5 rounded-md bg-white border border-[var(--color-outline-variant)]/30 hover:border-[var(--color-primary)]/30 shadow-sm">Save</button>
                            )}
                            <button onClick={() => handleDeletePlan(plan.id)} className="text-[0.75rem] font-bold text-[var(--color-on-surface-variant)] hover:text-[var(--color-error)] transition-colors px-3 py-1.5 rounded-md bg-white border border-[var(--color-outline-variant)]/30 hover:border-[var(--color-error)]/30 shadow-sm">Delete</button>
                          </div>
                        </div>
                        
                        {/* Right Section (Metadata) */}
                        <div className="md:w-48 flex flex-col items-start md:items-end text-left md:text-right gap-1 pt-1 border-t border-[var(--color-outline-variant)]/10 md:border-t-0 mt-4 md:mt-0 md:pt-0">
                          {plan.isSaved ? (
                            <span className="text-[0.75rem] font-bold text-[var(--color-primary)] mb-1 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></span>
                              Saved
                            </span>
                          ) : (
                            <span className="text-[0.75rem] font-bold text-[var(--color-secondary)] mb-1 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                              Unsaved
                            </span>
                          )}
                          <div className="text-[0.8125rem] font-bold text-[var(--color-on-surface-variant)]">{dateString}</div>
                          <div className="text-[0.75rem] font-medium text-[var(--color-secondary)]">{time}</div>
                          
                          <div className="mt-3 flex flex-wrap md:justify-end gap-1.5">
                             <div className="text-[0.6875rem] font-bold tracking-wider uppercase text-[var(--color-secondary)] bg-[#f9fafb] px-2 py-0.5 rounded border border-[var(--color-outline-variant)]/20">7 Days</div>
                             <div className="text-[0.6875rem] font-bold tracking-wider uppercase text-[var(--color-secondary)] bg-[#f9fafb] px-2 py-0.5 rounded border border-[var(--color-outline-variant)]/20">21 Meals</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 border-t border-[var(--color-outline-variant)]/10 pt-6">
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

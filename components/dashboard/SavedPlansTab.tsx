import { useState } from 'react';
import { Search, Bookmark } from 'lucide-react';
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
  isScrolled
}: SavedPlansTabProps) {
  const [savedSearchText, setSavedSearchText] = useState('');
  const [savedFilter, setSavedFilter] = useState<'All' | 'Recent' | 'Budget Friendly'>('All');

  const debouncedSearchText = useDebounce(savedSearchText, 300);

  const allSavedPlans = history.filter((p: MealPlanModel) => p.isSaved);
  
  // Stats
  const totalSaved = allSavedPlans.length;
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const savedThisMonth = allSavedPlans.filter((p: MealPlanModel) => {
    const d = new Date(p.createdAt);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;
  
  // Calculate last saved today
  const todayStr = new Date().toDateString();
  let lastSavedStr = "Never";
  if (allSavedPlans.length > 0) {
    // sort by date descending
    const sorted = [...allSavedPlans].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const lastDate = new Date(sorted[0].createdAt);
    if (lastDate.toDateString() === todayStr) {
      lastSavedStr = "Today";
    } else {
      lastSavedStr = lastDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  }

  // Filter
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
  
  // sort filtered plans by newest first
  filteredPlans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="pb-12 relative w-full">
      {/* Full-width sticky header container */}
      <div className={`sticky top-[-24px] lg:top-[-32px] z-40 -mx-4 px-4 lg:-mx-14 lg:px-14 pt-6 lg:pt-8 pb-4 mb-6 transition-all duration-500 ease-in-out ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.02)]' : 'bg-[#f9fafb]'}`}>
        {/* Inner content aligned with the list below */}
        <div className="max-w-5xl">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className={`font-bold text-[var(--color-on-surface)] tracking-tight transition-all duration-500 ease-in-out origin-left ${isScrolled ? 'text-[clamp(1.125rem,2vw,1.25rem)] scale-95' : 'text-[clamp(1.5rem,3vw+0.5rem,1.875rem)] scale-100'}`}>{title}</h2>
            </div>
            
            {/* Perfectly smooth collapse using CSS Grid */}
            <div className={`grid transition-all duration-500 ease-in-out ${isScrolled ? 'grid-rows-[0fr] opacity-0 mb-0' : 'grid-rows-[1fr] opacity-100 mt-2 mb-6'}`}>
              <div className="overflow-hidden">
                <p className="text-sm text-[var(--color-on-surface-variant)]">Manage and reuse your previously generated meal plans.</p>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-medium text-[var(--color-on-surface-variant)]">
                  <span>{totalSaved} Saved Plans</span>
                  <span className="opacity-50">•</span>
                  <span>{savedThisMonth} This Month</span>
                  <span className="opacity-50">•</span>
                  <span>Last Saved {lastSavedStr}</span>
                </div>
              </div>
            </div>

            {/* Search & Filter */}
            {allSavedPlans.length > 0 && (
              <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-500 ease-in-out ${isScrolled ? 'mt-3' : ''}`}>
                <div className="relative flex-1 flex items-center">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-[var(--color-on-surface-variant)] opacity-50 mt-[1px]" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search saved plans..." 
                    value={savedSearchText}
                    onChange={(e) => setSavedSearchText(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 rounded-full bg-white sm:bg-[#f9fafb] border border-[var(--color-outline-variant)]/30 focus:bg-white focus:border-[var(--color-primary)]/50 focus:ring-1 focus:ring-[var(--color-primary)]/20 text-sm transition-all outline-none"
                  />
                </div>
                <div className="flex bg-white sm:bg-[#f9fafb] p-1 rounded-full border border-[var(--color-outline-variant)]/30 self-start">
                  {(['All', 'Recent', 'Budget Friendly'] as const).map(filter => (
                    <button
                      key={filter}
                      onClick={() => setSavedFilter(filter)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${savedFilter === filter ? 'bg-white text-[var(--color-primary)] shadow-sm border border-[var(--color-outline-variant)]/20' : 'text-[var(--color-secondary)] hover:text-[var(--color-on-surface)]'}`}
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
      
      {/* Main Content List Container */}
      <div className="max-w-5xl">
        {allSavedPlans.length === 0 ? (
        <div className="rounded-2xl bg-[#f9fafb] border border-[var(--color-outline-variant)]/30 p-20 flex flex-col items-center justify-center text-center mt-8">
          <Bookmark className="w-12 h-12 text-[var(--color-outline-variant)] mb-4" />
          <h3 className="text-[clamp(1.125rem,2vw,1.25rem)] font-semibold text-[var(--color-on-surface)]">No saved plans yet</h3>
          <p className="text-[var(--color-on-surface-variant)] mt-2 max-w-md">Your saved meal plans will appear here. Generate a plan and click save to keep it for later.</p>
          <Button className="mt-6 font-bold" onClick={() => handleTabChange('generate')}>Generate Meal Plan</Button>
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="py-20 text-center text-[var(--color-on-surface-variant)] text-sm">
          No saved plans match your current filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlans.map((plan: MealPlanModel) => {
            const planDate = new Date(plan.createdAt);
            const dateString = planDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            
            return (
              <div key={plan.id} className="group bg-white rounded-2xl border border-[var(--color-outline-variant)]/30 overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[var(--color-primary)]/30 transition-all duration-300 flex flex-col h-full">
                {/* Header Pattern */}
                <div className="h-12 bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-primary)]/5 relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-24 h-24 bg-white/20 rounded-full -mr-8 -mt-8 backdrop-blur-3xl"></div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow relative">
                  {/* Bookmark Badge */}
                  <div className="absolute top-0 right-5 -mt-3 w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center shadow-sm text-white">
                    <Bookmark className="w-4 h-4 fill-current" />
                  </div>

                  <h3 className="font-extrabold text-[var(--color-on-surface)] tracking-tight text-lg mb-4 mt-1">
                    Meal Plan
                  </h3>
                  
                  <div className="space-y-4 flex-grow">
                    <div>
                      <p className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1">Budget</p>
                      <p className="text-[1.125rem] font-black text-[var(--color-on-surface)]">NGN {plan.budget.toLocaleString()}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1">Ingredients</p>
                      <p className="text-sm font-medium text-[var(--color-secondary)] line-clamp-3 leading-relaxed">
                        {plan.ingredients.split(',').map((i: string) => i.trim()).filter((i: string) => i).join(' • ')}
                      </p>
                    </div>
                  </div>
                  
                  {/* Footer metadata */}
                  <div className="mt-6 pt-4 border-t border-[var(--color-outline-variant)]/20 flex items-center justify-between">
                     <span className="text-xs font-bold text-[var(--color-secondary)] bg-[#f9fafb] px-2 py-1 rounded">7 Days</span>
                     <span className="text-xs font-bold text-[var(--color-on-surface-variant)]">{dateString}</span>
                  </div>

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-6 pointer-events-none group-hover:pointer-events-auto">
                    <div className="flex flex-wrap items-center gap-3">
                      <button onClick={() => handleViewOnlyPlan(plan)} className="text-[0.8125rem] font-bold text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors px-4 py-2 rounded-lg bg-white border border-[var(--color-outline-variant)]/30 hover:border-[var(--color-primary)]/30 shadow-sm">View Plan</button>
                      <button onClick={() => handleDeletePlan(plan.id)} className="text-[0.8125rem] font-bold text-[var(--color-on-surface-variant)] hover:text-[var(--color-error)] transition-colors px-4 py-2 rounded-lg bg-white border border-[var(--color-outline-variant)]/30 hover:border-[var(--color-error)]/30 shadow-sm">Delete</button>
                      <Button onClick={() => handleReusePlan(plan)} className="h-9 px-6 text-[0.8125rem] font-bold shadow-sm">Reuse Plan</Button>
                    </div>
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

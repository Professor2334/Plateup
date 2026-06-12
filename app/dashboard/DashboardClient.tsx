'use client';

import { useState, useEffect } from 'react';
import { SupportTab } from '@/components/dashboard/SupportTab';
import { PrivacyTab } from '@/components/dashboard/PrivacyTab';
import { TermsTab } from '@/components/dashboard/TermsTab';
import { GenerateMealForm } from '@/components/meal-plans/GenerateMealForm';
import { MealPlanSkeleton } from '@/components/meal-plans/MealPlanSkeleton';
import type { MealPlanResponse } from '@/lib/deepseek';
import { Button } from '@/components/ui/button';
import { saveMealPlan, deleteMealPlan } from '@/app/actions/meal-plans/actions';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { History, Bookmark, Settings, LogOut, Calendar, LayoutDashboard, Utensils, Search, User, Lock, Shield, FileText, LifeBuoy, Mail, CheckCircle2 } from 'lucide-react';
import { VerificationBanner } from '@/components/dashboard/VerificationBanner';
import { PlateUpLogo } from '@/components/shared/PlateUpLogo';
import { logoutUser } from '@/app/actions/auth/actions';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { updatePreferences, changePassword, updateProfile } from '@/app/actions/settings/actions';
import { MealPlanResults } from '@/components/meal-plans/MealPlanResults';

interface DashboardClientProps {
  initialHistory: any[];
  userName: string;
  userData: {
    name: string;
    email: string;
    emailVerified: boolean;
    householdSize: string;
    primaryGoal: string;
  };
}

type Tab = 'generate' | 'history' | 'saved' | 'settings' | 'view-plan' | 'support' | 'privacy' | 'terms';

export function DashboardClient({ initialHistory, userName, userData }: DashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const viewParam = searchParams.get('view');

  const [history, setHistory] = useState(initialHistory);
  const [activeTab, setActiveTab] = useState<Tab>('generate');
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);

  useEffect(() => {
    if (viewParam) {
      const paramToTabMap: Record<string, Tab> = {
        'generate-plan': 'generate',
        'meal-history': 'history',
        'saved-plans': 'saved',
        'settings': 'settings',
        'view-plan': 'view-plan',
        'support': 'support',
        'privacy': 'privacy',
        'terms': 'terms'
      };
      if (paramToTabMap[viewParam]) {
        setActiveTab(paramToTabMap[viewParam]);
      }
    } else {
      router.replace(`${pathname}?view=generate-plan`, { scroll: false });
    }
  }, [viewParam, pathname, router]);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setIsScrolled(false);
    const tabToParamMap: Record<Tab, string> = {
      'generate': 'generate-plan',
      'history': 'meal-history',
      'saved': 'saved-plans',
      'settings': 'settings',
      'view-plan': 'view-plan',
      'support': 'support',
      'privacy': 'privacy',
      'terms': 'terms'
    };
    const newUrl = `${pathname}?view=${tabToParamMap[tab]}`;
    window.history.pushState(null, '', newUrl);
  };
  
  useEffect(() => {
    setHistory(initialHistory);
  }, [initialHistory]);

  // Re-show verification banner every 20 minutes if not verified
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isBannerDismissed && !userData.emailVerified) {
      // 20 minutes = 20 * 60 * 1000 = 1200000 ms
      timeoutId = setTimeout(() => {
        setIsBannerDismissed(false);
      }, 1200000);
    }
    return () => clearTimeout(timeoutId);
  }, [isBannerDismissed, userData.emailVerified]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<MealPlanResponse | null>(null);
  const [activeBudget, setActiveBudget] = useState(0);
  const [activeIngredients, setActiveIngredients] = useState('');
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  // Settings State
  const [prefSaving, setPrefSaving] = useState(false);
  const [prefHousehold, setPrefHousehold] = useState(userData?.householdSize || '1');
  const [prefGoal, setPrefGoal] = useState(userData?.primaryGoal || 'save-money');
  const [passSaving, setPassSaving] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  
  // Logout Modal State
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Edit Profile Modal State
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  // History State
  const [historySearchText, setHistorySearchText] = useState('');
  const [historyFilter, setHistoryFilter] = useState<'All' | 'Saved' | 'Unsaved'>('All');

  // Saved Plans State
  const [savedSearchText, setSavedSearchText] = useState('');
  const [savedFilter, setSavedFilter] = useState<'All' | 'Recent' | 'Budget Friendly'>('All');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLogoutModalOpen) {
        setIsLogoutModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLogoutModalOpen]);

  const handlePlanGenerated = (plan: MealPlanResponse, budget: number, ingredients: string, id: string) => {
    setGeneratedPlan(plan);
    setActiveBudget(budget);
    setActiveIngredients(ingredients);
    setActivePlanId(id);
    
    // Add the newly created unsaved plan to history state manually so it shows in timeline instantly
    const newPlan = {
      id,
      budget,
      ingredients,
      generatedPlan: plan.mealPlan,
      shoppingList: plan.shoppingList,
      isSaved: false,
      createdAt: new Date().toISOString(),
    };
    setHistory(prev => [newPlan, ...prev]);
  };

  const handleSavePlanById = async (id: string) => {
    const res = await saveMealPlan(id);
    if (res.success) {
      setHistory(prev => prev.map(p => p.id === id ? { ...p, isSaved: true } : p));
      router.refresh();
      return true;
    }
    return false;
  };

  const handleSavePlan = async () => {
    if (!activePlanId) return;
    setSaving(true);
    const success = await handleSavePlanById(activePlanId);
    setSaving(false);
    if (success) {
      alert('Meal plan saved successfully!');
    } else {
      alert('Failed to save meal plan.');
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (confirm('Are you sure you want to delete this saved plan?')) {
      setHistory(prev => prev.filter(plan => plan.id !== id));
      await deleteMealPlan(id);
      router.refresh();
    }
  };

  const handleReusePlan = (plan: any) => {
    setGeneratedPlan({
      mealPlan: plan.generatedPlan,
      shoppingList: plan.shoppingList,
      estimatedCost: plan.budget,
      budgetStatus: 'WITHIN_BUDGET'
    });
    setActiveBudget(plan.budget);
    setActiveIngredients(plan.ingredients);
    setActivePlanId(plan.id);
    handleTabChange('generate');
  };

  const handleViewOnlyPlan = (plan: any) => {
    setGeneratedPlan({
      mealPlan: plan.generatedPlan,
      shoppingList: plan.shoppingList,
      estimatedCost: plan.budget,
      budgetStatus: 'WITHIN_BUDGET'
    });
    setActiveBudget(plan.budget);
    setActiveIngredients(plan.ingredients);
    setActivePlanId(plan.id);
    handleTabChange('view-plan');
  };

  const shareViaWhatsApp = async (selectedItems?: Set<number>) => {
    if (!generatedPlan) return;
    
    // 1. Generate PDF
    const doc = new jsPDF();
    
    // Add Title
    doc.setFontSize(20);
    doc.setTextColor(20, 128, 60); // PlateUp Green
    doc.text('PlateUp Weekly Meal Plan', 14, 22);
    
    // Add Subtitle
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Budget: NGN ${activeBudget}`, 14, 30);
    doc.text(`Ingredients: ${activeIngredients}`, 14, 36);

    // Add Meal Plan Table
    const mealData = generatedPlan.mealPlan.map(day => [
      day.day,
      day.breakfast,
      day.lunch,
      day.dinner
    ]);

    autoTable(doc, {
      startY: 44,
      head: [['Day', 'Breakfast', 'Lunch', 'Dinner']],
      body: mealData,
      theme: 'grid',
      headStyles: { fillColor: [20, 128, 60] },
      styles: { fontSize: 9 },
    });

    // Add Shopping List Title
    const finalY = (doc as any).lastAutoTable.finalY || 44;
    doc.setFontSize(16);
    doc.setTextColor(20, 128, 60);
    doc.text('Shopping List', 14, finalY + 15);

    // Add Shopping List Table
    const filteredList = selectedItems && selectedItems.size > 0
      ? generatedPlan.shoppingList.filter((_, idx) => selectedItems.has(idx))
      : generatedPlan.shoppingList;

    const shoppingData = filteredList.map(item => [
      item.item,
      item.quantity
    ]);

    autoTable(doc, {
      startY: finalY + 20,
      head: [['Item', 'Quantity']],
      body: shoppingData,
      theme: 'grid',
      headStyles: { fillColor: [20, 128, 60] },
      styles: { fontSize: 9 },
    });

    // 2. Try Web Share API (Mobile native sharing)
    const pdfBlob = doc.output('blob');
    const file = new File([pdfBlob], 'PlateUp-Meal-Plan.pdf', { type: 'application/pdf' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: 'My PlateUp Meal Plan',
          text: 'Here is my weekly meal plan generated by PlateUp!',
          files: [file],
        });
        return; // Successfully shared
      } catch (err) {
        console.log('Share was cancelled or failed', err);
      }
    }

    // 3. Fallback for Desktop: Download the PDF and open WhatsApp Web
    doc.save('PlateUp-Meal-Plan.pdf');
    const encodedText = encodeURIComponent('I just generated my weekly meal plan using PlateUp! I have attached the PDF.');
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  const renderGenerateTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl relative">
      {/* Left Form */}
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-6 space-y-6 max-h-[calc(100vh-3rem)] overflow-y-auto scrollbar-thin overflow-x-hidden pr-2 pb-4">
        <GenerateMealForm 
          onPlanGenerated={(plan, formData, id) => {
            const b = parseFloat(formData.get('budget') as string);
            const i = formData.get('ingredients') as string;
            handlePlanGenerated(plan, b, i, id);
          }}
          onLoadingChange={setLoading}
        />
        </div>
      </div>

      {/* Right Content */}
      <div className="lg:col-span-8">
        {loading ? (
          <div className="space-y-6">
            <h1 className="text-[clamp(1.25rem,2vw+0.5rem,1.5rem)] font-bold text-[var(--color-primary)]">Generating your meal plan...</h1>
            <p className="text-[var(--color-on-surface-variant)]">This takes about 10-15 seconds. Hang tight!</p>
            <MealPlanSkeleton />
          </div>
        ) : generatedPlan ? (
          <MealPlanResults
            plan={generatedPlan}
            budget={activeBudget}
            ingredients={activeIngredients}
            onSave={handleSavePlan}
            isSaving={saving}
            onShare={shareViaWhatsApp}
            onRegenerate={() => {
              setGeneratedPlan(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isSaved={history.some(p => p.id === activePlanId && p.isSaved)}
          />
        ) : (
          <div className="rounded-[18px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] p-12 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 rounded-full bg-[color-mix(in_srgb,var(--color-surface-container-low)_50%,transparent)] flex items-center justify-center mb-6">
              <Utensils className="w-8 h-8 text-[var(--color-on-surface-variant)] opacity-60" strokeWidth={1.5} />
            </div>
            <h3 className="text-[clamp(1.125rem,2vw,1.25rem)] sm:text-[clamp(1.25rem,2vw+0.5rem,1.5rem)] font-bold text-[var(--color-on-surface)] tracking-tight">No meal plan active</h3>
            <p className="mt-3 text-[0.875rem] font-medium text-[var(--color-on-surface-variant)] opacity-70 max-w-sm leading-relaxed">
              Use the form on the left to generate a new 7-day budget-aware Nigerian meal plan.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderHistoryTab = () => {
    // 1. Filter history
    const filteredHistory = history.filter((plan: any) => {
      if (historyFilter === 'Saved' && !plan.isSaved) return false;
      if (historyFilter === 'Unsaved' && plan.isSaved) return false;
      if (historySearchText) {
        const searchLower = historySearchText.toLowerCase();
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
    const groups: Record<string, any[]> = {
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

    filteredHistory.forEach((plan: any) => {
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
    const thisWeekGenerated = history.filter((p: any) => new Date(p.createdAt) >= lastWeek).length;

    return (
      <div className="pb-12 relative w-full">
        {/* Full-width sticky header container */}
        <div className={`sticky top-[-24px] lg:top-[-32px] z-40 -mx-10 px-10 lg:-mx-14 lg:px-14 pt-6 lg:pt-8 pb-4 mb-6 transition-all duration-500 ease-in-out ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.02)]' : 'bg-[#f9fafb]'}`}>
          <div className="max-w-5xl">
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <h2 className={`font-bold text-[var(--color-on-surface)] tracking-tight transition-all duration-500 ease-in-out origin-left ${isScrolled ? 'text-[clamp(1.125rem,2vw,1.25rem)] scale-95' : 'text-[clamp(1.5rem,3vw+0.5rem,1.875rem)] scale-100'}`}>Meal History</h2>
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
            <div className="w-16 h-16 rounded-full bg-[#f9fafb] flex items-center justify-center mb-4">
              <span className="text-[clamp(1.5rem,3vw+0.5rem,1.875rem)]">🍲</span>
            </div>
            <h3 className="text-lg font-bold text-[var(--color-on-surface)]">No meal plans yet</h3>
            <p className="text-sm text-[var(--color-on-surface-variant)] mt-2 max-w-sm">Generate your first meal plan to start building your history.</p>
            <Button className="mt-6 font-bold" onClick={() => handleTabChange('generate')}>Generate Meal Plan</Button>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="py-20 text-center text-[var(--color-on-surface-variant)] text-sm">
            No meal plans match your current filters.
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groups).map(([groupName, plans]) => {
              if (plans.length === 0) return null;
              return (
                <div key={groupName} className="relative bg-white rounded-[24px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <h3 className="text-[0.6875rem] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest mb-6 ml-6">{groupName}</h3>
                  <div className="space-y-0 relative">
                    {/* Vertical Timeline Spine */}
                    <div className="absolute left-2 top-2 bottom-4 w-px bg-[var(--color-outline-variant)]/30"></div>
                    
                    {plans.map((plan: any) => {
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
          </div>
        )}
        </div>
      </div>
    );
  };

  const renderSavedTab = (title: string) => {
    const allSavedPlans = history.filter(p => p.isSaved);
    // Stats
    const totalSaved = allSavedPlans.length;
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const savedThisMonth = allSavedPlans.filter(p => {
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
    let filteredPlans = allSavedPlans.filter((plan: any) => {
      if (savedFilter === 'Budget Friendly' && plan.budget > 15000) return false;
      if (savedFilter === 'Recent') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        if (new Date(plan.createdAt) < oneWeekAgo) return false;
      }
      
      if (savedSearchText) {
        const searchLower = savedSearchText.toLowerCase();
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
        <div className={`sticky top-[-24px] lg:top-[-32px] z-40 -mx-10 px-10 lg:-mx-14 lg:px-14 pt-6 lg:pt-8 pb-4 mb-6 transition-all duration-500 ease-in-out ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.02)]' : 'bg-[#f9fafb]'}`}>
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
          <div className="space-y-0 rounded-[24px] bg-white overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)]">
            {filteredPlans.map((plan: any, index: number) => {
              const date = new Date(plan.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
              const previewMeals = plan.generatedPlan?.slice(0, 3) || [];
              const isBudgetFriendly = plan.budget <= 15000;
              const titleTag = isBudgetFriendly ? "Budget-Friendly Student Plan" : "Standard Nigerian Plan";
              
              return (
                <div key={plan.id} className={`group relative p-6 sm:p-8 hover:bg-[#f9fafb] transition-colors ${index !== filteredPlans.length - 1 ? 'border-b border-[var(--color-outline-variant)]/10' : ''}`}>
                  
                  {/* Top Row: Title & Tag */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-[clamp(1.125rem,2vw,1.25rem)] font-extrabold text-[var(--color-on-surface)] tracking-tight">{titleTag}</h3>
                    <span className="text-[0.6875rem] font-bold tracking-wider uppercase text-[var(--color-secondary)] bg-[#f9fafb] px-2.5 py-1 rounded border border-[var(--color-outline-variant)]/20">
                      [7 Days]
                    </span>
                  </div>

                  {/* Metadata Row: Budget & Date */}
                  <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-on-surface)] mb-6">
                    <span className="text-[var(--color-primary)]">₦{plan.budget.toLocaleString()}</span>
                    <span className="text-[var(--color-outline-variant)]">•</span>
                    <span className="text-[var(--color-secondary)]">Saved {date}</span>
                  </div>

                  {/* Ingredients */}
                  <div className="mb-6 max-w-3xl">
                    <h4 className="text-[0.6875rem] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">Ingredients</h4>
                    <p className="text-[0.875rem] text-[var(--color-on-surface)] font-medium leading-relaxed">
                      {plan.ingredients.split(',').map((i: string) => i.trim()).filter((i: string) => i).join(' • ')}
                    </p>
                  </div>

                  {/* Meal Preview */}
                  <div className="mb-8 max-w-3xl">
                    <h4 className="text-[0.6875rem] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-3">Preview</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {previewMeals.map((day: any, i: number) => (
                        <div key={i} className="flex gap-3 text-[0.8125rem]">
                          <span className="font-bold text-[var(--color-primary)] w-8 flex-shrink-0">{day.day.substring(0, 3)}</span>
                          <span className="text-[var(--color-on-surface-variant)] truncate font-medium">{day.lunch}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer & Actions */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-5 border-t border-[var(--color-outline-variant)]/10 gap-4 sm:gap-0">
                    <div className="flex items-center gap-2 text-[0.75rem] font-bold text-[var(--color-secondary)]">
                      <span>7 Meals</span>
                      <span>•</span>
                      <span>21 Dishes</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button onClick={() => handleViewOnlyPlan(plan)} className="text-[0.8125rem] font-bold text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors px-4 py-2 rounded-lg bg-white border border-[var(--color-outline-variant)]/30 hover:border-[var(--color-primary)]/30 shadow-sm">View Plan</button>
                      <button onClick={() => handleDeletePlan(plan.id)} className="text-[0.8125rem] font-bold text-[var(--color-on-surface-variant)] hover:text-[var(--color-error)] transition-colors px-4 py-2 rounded-lg bg-white border border-[var(--color-outline-variant)]/30 hover:border-[var(--color-error)]/30 shadow-sm">Delete</button>
                      <Button onClick={() => handleReusePlan(plan)} className="h-9 px-6 text-[0.8125rem] font-bold shadow-sm">Reuse Plan</Button>
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
  };

  const renderSettingsTab = () => {
    // Generate initials for avatar
    const initials = userData.name ? userData.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

    return (
      <div className="pb-12 relative w-full">
        {/* Full-width sticky header container */}
        <div className={`sticky top-[-24px] lg:top-[-32px] z-40 -mx-10 px-10 lg:-mx-14 lg:px-14 pt-6 lg:pt-8 pb-4 mb-6 transition-all duration-500 ease-in-out ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.02)]' : 'bg-[#f9fafb]'}`}>
          <div className="max-w-5xl">
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <h2 className={`font-bold text-[var(--color-on-surface)] tracking-tight transition-all duration-500 ease-in-out origin-left ${isScrolled ? 'text-[clamp(1.125rem,2vw,1.25rem)] scale-95' : 'text-[clamp(1.5rem,3vw+0.5rem,1.875rem)] scale-100'}`}>Settings</h2>
              </div>
              
              {/* Perfectly smooth collapse using CSS Grid */}
              <div className={`grid transition-all duration-500 ease-in-out ${isScrolled ? 'grid-rows-[0fr] opacity-0 mb-0' : 'grid-rows-[1fr] opacity-100 mt-2 mb-6'}`}>
                <div className="overflow-hidden">
                  <p className="text-sm text-[var(--color-on-surface-variant)]">Manage your account preferences and security settings.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl">
          {/* 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Left Column */}
          <div className="space-y-6 lg:space-y-8">
            
            {/* Profile Section */}
            <div className="bg-white border border-black/[0.03] rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[var(--color-on-surface)] mb-8 flex items-center gap-2">
                <User className="w-5 h-5 text-[var(--color-primary)]" />
                Profile Information
              </h3>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-[color-mix(in_srgb,var(--color-primary)_15%,white)] flex items-center justify-center flex-shrink-0 text-[var(--color-primary)] text-[clamp(1.25rem,2vw+0.5rem,1.5rem)] font-bold tracking-tight">
                  {initials}
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <h4 className="text-[clamp(1.125rem,2vw,1.25rem)] font-bold text-[var(--color-on-surface)] truncate">{userData.name}</h4>
                  <p className="text-[0.875rem] text-[var(--color-on-surface-variant)] flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{userData.email}</span>
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.6875rem] font-bold uppercase tracking-wider bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] text-[var(--color-primary)]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-[var(--color-outline-variant)]/20">
                <Button onClick={() => setIsEditProfileModalOpen(true)} variant="outline" className="w-full sm:w-auto text-sm font-bold shadow-sm">
                  Edit Profile
                </Button>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="bg-white border border-black/[0.03] rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[var(--color-on-surface)] mb-8 flex items-center gap-2">
                <Settings className="w-5 h-5 text-[var(--color-primary)]" />
                Preferences
              </h3>
              
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  setPrefSaving(true);
                  const res = await updatePreferences(prefHousehold, prefGoal);
                  setPrefSaving(false);
                  if (res.success) {
                    alert('Preferences updated successfully!');
                  } else {
                    alert(res.error || 'Failed to update preferences.');
                  }
                }}
                className="space-y-6"
              >
                {/* Simulated static row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[var(--color-outline-variant)]/20">
                  <div>
                    <p className="text-[0.875rem] font-bold text-[var(--color-on-surface)]">Currency</p>
                    <p className="text-[0.8125rem] text-[var(--color-on-surface-variant)]">Display currency for meal plans</p>
                  </div>
                  <div className="text-[0.875rem] font-semibold text-[var(--color-on-surface)] px-4 py-2 bg-[#f9fafb] rounded-lg border border-[var(--color-outline-variant)]/20">
                    NGN (₦)
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4 pb-4 border-b border-[var(--color-outline-variant)]/20">
                  <div className="flex-1">
                    <label className="text-[0.875rem] font-bold text-[var(--color-on-surface)] mb-1 block">Household Size</label>
                    <p className="text-[0.8125rem] text-[var(--color-on-surface-variant)] mb-3 sm:mb-0">How many people are you cooking for?</p>
                  </div>
                  <select 
                    value={prefHousehold}
                    onChange={e => setPrefHousehold(e.target.value)}
                    className="w-full sm:w-48 text-[0.875rem] font-medium text-[var(--color-on-surface)] bg-[#f9fafb] border border-[var(--color-outline-variant)]/30 rounded-lg px-3 py-2 focus:outline-none focus:bg-white focus:border-[var(--color-primary)] transition-colors h-10"
                  >
                    <option value="1">1 Person</option>
                    <option value="2">2 People</option>
                    <option value="3-4">3-4 People</option>
                    <option value="5+">5+ People</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4 pb-4 border-b border-[var(--color-outline-variant)]/20">
                  <div className="flex-1">
                    <label className="text-[0.875rem] font-bold text-[var(--color-on-surface)] mb-1 block">Primary Goal</label>
                    <p className="text-[0.8125rem] text-[var(--color-on-surface-variant)] mb-3 sm:mb-0">What is your main focus for meal planning?</p>
                  </div>
                  <select 
                    value={prefGoal}
                    onChange={e => setPrefGoal(e.target.value)}
                    className="w-full sm:w-48 text-[0.875rem] font-medium text-[var(--color-on-surface)] bg-[#f9fafb] border border-[var(--color-outline-variant)]/30 rounded-lg px-3 py-2 focus:outline-none focus:bg-white focus:border-[var(--color-primary)] transition-colors h-10"
                  >
                    <option value="save-money">Save Money</option>
                    <option value="save-time">Save Time</option>
                    <option value="reduce-waste">Reduce Food Waste</option>
                    <option value="eat-healthier">Eat Healthier</option>
                  </select>
                </div>
                
                <div className="pt-2 flex justify-end">
                  <Button type="submit" disabled={prefSaving} className="w-full sm:w-auto font-bold shadow-sm text-sm">
                    {prefSaving ? 'Saving...' : 'Save Preferences'}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 lg:space-y-8">
            
            {/* Security Section */}
            <div className="bg-white border border-black/[0.03] rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[var(--color-on-surface)] mb-8 flex items-center gap-2">
                <Lock className="w-5 h-5 text-[var(--color-primary)]" />
                Security
              </h3>
              
              <form 
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setPassSaving(true);
                  setPassSuccess('');
                  setPassError('');
                  const formData = new FormData(e.currentTarget);
                  const res = await changePassword(formData);
                  setPassSaving(false);
                  if (res.success) {
                    setPassSuccess('Password updated successfully');
                    (e.target as HTMLFormElement).reset();
                  } else {
                    setPassError(res.error || 'Failed to update password');
                  }
                }}
              >
                <div>
                  <label className="text-[0.8125rem] font-bold text-[var(--color-on-surface)] mb-2 block">Change Password</label>
                  <div className="space-y-3">
                    <input 
                      type="password" 
                      name="currentPassword" 
                      placeholder="Current Password" 
                      required
                      className="w-full text-[0.875rem] text-[var(--color-on-surface)] bg-[#f9fafb] border border-[var(--color-outline-variant)]/30 rounded-lg px-4 py-2.5 focus:outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all"
                    />
                    <input 
                      type="password" 
                      name="newPassword" 
                      placeholder="New Password" 
                      required
                      className="w-full text-[0.875rem] text-[var(--color-on-surface)] bg-[#f9fafb] border border-[var(--color-outline-variant)]/30 rounded-lg px-4 py-2.5 focus:outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all"
                    />
                  </div>
                </div>
                
                {passError && <p className="text-[0.8125rem] font-semibold text-[var(--color-error)]">{passError}</p>}
                {passSuccess && <p className="text-[0.8125rem] font-semibold text-[var(--color-primary)]">{passSuccess}</p>}
                
                <div className="pt-2">
                  <Button type="submit" variant="outline" disabled={passSaving} className="w-full sm:w-auto text-sm font-bold shadow-sm">
                    {passSaving ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </form>

              <div className="mt-8 pt-8 border-t border-[var(--color-outline-variant)]/10">
                <div className="bg-[color-mix(in_srgb,var(--color-error)_4%,transparent)] rounded-[12px] p-5 border border-[var(--color-error)]/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-[0.875rem] font-bold text-[var(--color-error)]">Sign Out</h4>
                      <p className="text-[0.8125rem] text-[var(--color-error)]/70 mt-1">End your session on this device.</p>
                    </div>
                    <button
                      onClick={() => setIsLogoutModalOpen(true)}
                      className="flex items-center justify-center gap-2 text-[0.875rem] font-bold text-white bg-[var(--color-error)] px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Support & Legal Section */}
            <div className="bg-white border border-black/[0.03] rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[var(--color-on-surface)] mb-8 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[var(--color-primary)]" />
                Support & Legal
              </h3>
              
              <div className="space-y-2">
                <button onClick={() => handleTabChange('support')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#f9fafb] transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] flex items-center justify-center text-[var(--color-primary)]">
                      <LifeBuoy className="w-4 h-4" />
                    </div>
                    <span className="text-[0.875rem] font-semibold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors">Contact Support</span>
                  </div>
                  <span className="text-[var(--color-on-surface-variant)] opacity-50">&rarr;</span>
                </button>

                <button onClick={() => handleTabChange('terms')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#f9fafb] transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f9fafb] border border-[var(--color-outline-variant)]/30 flex items-center justify-center text-[var(--color-secondary)]">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-[0.875rem] font-semibold text-[var(--color-on-surface)]">Terms of Service</span>
                  </div>
                  <span className="text-[var(--color-on-surface-variant)] opacity-50">&rarr;</span>
                </button>

                <button onClick={() => handleTabChange('privacy')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#f9fafb] transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f9fafb] border border-[var(--color-outline-variant)]/30 flex items-center justify-center text-[var(--color-secondary)]">
                      <Shield className="w-4 h-4" />
                    </div>
                    <span className="text-[0.875rem] font-semibold text-[var(--color-on-surface)]">Privacy Policy</span>
                  </div>
                  <span className="text-[var(--color-on-surface-variant)] opacity-50">&rarr;</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

  const SidebarItem = ({ icon: Icon, label, tab }: { icon: any, label: string, tab: Tab }) => (
    <button
      onClick={() => handleTabChange(tab)}
      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-[10px] transition-all duration-200 group ${
        activeTab === tab 
          ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-[0_8px_30px_rgba(17,94,59,0.25)] font-semibold' 
          : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-on-surface)] font-medium'
      }`}
    >
      <Icon className={`w-4 h-4 transition-colors ${activeTab === tab ? 'text-[var(--color-on-primary)]' : 'text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-on-surface)]'}`} />
      <span className="text-[0.8125rem]">{label}</span>
    </button>
  );

  const handleMainScroll = (e: React.UIEvent<HTMLElement>) => {
    setIsScrolled(e.currentTarget.scrollTop > 30);
  };

  return (
    <>
      <div className={`flex h-screen overflow-hidden bg-[#f9fafb] font-sans transition-all duration-300 ${isLogoutModalOpen ? 'blur-[4px] scale-[0.99] opacity-90' : ''}`}>
        {/* Sidebar */}
      <aside className="w-64 bg-white shadow-[1px_0_12px_rgba(0,0,0,0.03)] dark:bg-[var(--color-surface-container-low)] flex flex-col flex-shrink-0 z-10">
        <div className="px-8 pt-8 pb-4">
          <PlateUpLogo size="lg" href={null} />
        </div>
        
        <div className="px-8 pb-8">
          <p className="text-[0.8125rem] font-medium text-[var(--color-on-surface-variant)] opacity-80 flex items-center justify-start gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${userData.emailVerified ? 'bg-[#10b981]' : 'bg-[var(--color-accent)]'}`}></span> 
            {userData.emailVerified ? 'Verified Account' : 'Unverified Account'}
          </p>
        </div>

        <nav className="flex-1 px-5 space-y-1">
          <SidebarItem icon={LayoutDashboard} label="Generate Plan" tab="generate" />
          <SidebarItem icon={History} label="Meal History" tab="history" />
          <SidebarItem icon={Bookmark} label="Saved Plans" tab="saved" />
          <SidebarItem icon={Settings} label="Settings" tab="settings" />
        </nav>

        <div className="px-5 pb-6 pt-4 flex flex-col gap-4">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-[10px] text-[var(--color-on-surface-variant)] opacity-80 hover:bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] hover:text-[var(--color-error)] hover:opacity-100 transition-all group"
          >
            <LogOut className="w-4 h-4 transition-colors group-hover:text-[var(--color-error)]" />
            <span className="font-medium text-[0.8125rem]">Logout</span>
          </button>

          <div className="flex items-center justify-between gap-1 px-3">
            <button onClick={() => handleTabChange('support')} className="text-[0.75rem] font-medium text-[var(--color-on-surface-variant)] opacity-50 hover:text-[var(--color-primary)] hover:opacity-100 transition-all">Contact</button>
            <button onClick={() => handleTabChange('terms')} className="text-[0.75rem] font-medium text-[var(--color-on-surface-variant)] opacity-50 hover:text-[var(--color-primary)] hover:opacity-100 transition-all">Terms</button>
            <button onClick={() => handleTabChange('privacy')} className="text-[0.75rem] font-medium text-[var(--color-on-surface-variant)] opacity-50 hover:text-[var(--color-primary)] hover:opacity-100 transition-all">Privacy</button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        className="flex-1 overflow-y-auto px-10 pb-10 pt-6 lg:px-14 lg:pb-14 lg:pt-8 relative"
        onScroll={handleMainScroll}
      >
        {/* Welcome Experience (Banner OR Welcome Section) */}
        {(!userData.emailVerified && !isBannerDismissed) ? (
          <div className="mb-8 animate-in fade-in duration-300">
            <VerificationBanner email={userData.email} onDismiss={() => setIsBannerDismissed(true)} />
          </div>
        ) : activeTab === 'generate' ? (
          <div className="mb-8 bg-white rounded-[20px] px-6 py-4 sm:px-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col justify-center animate-in fade-in duration-300 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[var(--color-primary)] opacity-80"></div>
            <h1 className="text-[clamp(1.125rem,2vw,1.25rem)] sm:text-[clamp(1.25rem,2vw+0.5rem,1.5rem)] font-extrabold text-[var(--color-on-surface)] tracking-tight mb-0.5">
              Welcome, {userName.split(' ')[0]}
            </h1>
            <p className="text-[0.875rem] text-[var(--color-on-surface-variant)] font-medium opacity-80">Ready to plan this week's meals?</p>
          </div>
        ) : null}
        {activeTab === 'generate' && renderGenerateTab()}
        {activeTab === 'view-plan' && generatedPlan && (
          <div className="max-w-7xl space-y-6">
            <button onClick={() => handleTabChange('history')} className="text-sm font-medium text-[var(--color-primary)] hover:underline mb-4 flex items-center gap-1">
              &larr; Back to History
            </button>
            <MealPlanResults
              plan={generatedPlan!}
              budget={activeBudget}
              ingredients={activeIngredients}
              onSave={handleSavePlan}
              isSaving={saving}
              onShare={shareViaWhatsApp}
              onRegenerate={() => {
                handleTabChange('generate');
              }}
              isSaved={history.some(p => p.id === activePlanId && p.isSaved)}
            />
          </div>
        )}
        {activeTab === 'history' && renderHistoryTab()}
        {activeTab === 'saved' && renderSavedTab('Saved Plans')}
        {activeTab === 'settings' && renderSettingsTab()}
        {activeTab === 'support' && <SupportTab email={userData.email} isScrolled={isScrolled} />}
        {activeTab === 'privacy' && <PrivacyTab isScrolled={isScrolled} />}
        {activeTab === 'terms' && <TermsTab isScrolled={isScrolled} />}
      </main>
    </div>

    {/* Logout Confirmation Modal */}
    {isLogoutModalOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
        <div 
          className="absolute inset-0 bg-[var(--color-background)]/30 backdrop-blur-md transition-opacity duration-300"
          onClick={() => setIsLogoutModalOpen(false)}
        />
        <div className="relative bg-[var(--color-surface)] w-full max-w-[360px] rounded-[24px] shadow-[0_16px_40px_rgb(0,0,0,0.12)] p-6 sm:p-8 animate-in zoom-in-95 fade-in duration-200">
          <h3 className="text-[1.25rem] font-bold text-[var(--color-on-surface)] mb-2 tracking-tight">Log out of PlateUp?</h3>
          <p className="text-[0.875rem] text-[var(--color-on-surface-variant)] mb-8 leading-relaxed">
            You'll need to sign in again to access your meal plans and saved history.
          </p>
          <div className="flex flex-col gap-3">
            <Button 
              onClick={async () => {
                setIsLoggingOut(true);
                await logoutUser();
              }}
              disabled={isLoggingOut}
              className="w-full min-h-[48px] rounded-xl font-semibold shadow-sm text-[0.9375rem] hover:opacity-90 transition-opacity border-none disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-error)', color: 'var(--color-on-error)' }}
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsLogoutModalOpen(false)}
              className="w-full min-h-[48px] rounded-xl font-semibold border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] hover:bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] text-[0.9375rem]"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    )}

    {/* Edit Profile Modal */}
    {isEditProfileModalOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <div 
          className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsEditProfileModalOpen(false)}
        />
        <div className="relative bg-[var(--color-surface)] w-full max-w-[400px] rounded-[24px] shadow-[0_16px_40px_rgb(0,0,0,0.12)] p-6 sm:p-8 animate-in zoom-in-95 fade-in duration-200">
          <h3 className="text-[1.25rem] font-bold text-[var(--color-on-surface)] mb-2 tracking-tight">Edit Profile</h3>
          <p className="text-[0.875rem] text-[var(--color-on-surface-variant)] mb-6 leading-relaxed">
            Update your display name.
          </p>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const name = formData.get('name') as string;
            
            const submitBtn = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement;
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Saving...';
            submitBtn.disabled = true;

            const res = await updateProfile(name);
            
            if (res.success) {
              setIsEditProfileModalOpen(false);
            } else {
              alert(res.error || 'Failed to update profile');
              submitBtn.textContent = originalText;
              submitBtn.disabled = false;
            }
          }}>
            <div className="space-y-4 mb-8">
              <div>
                <label className="text-[0.8125rem] font-bold text-[var(--color-on-surface)] mb-2 block">Display Name</label>
                <input 
                  type="text" 
                  name="name" 
                  defaultValue={userData.name}
                  required
                  minLength={2}
                  className="w-full text-[0.9375rem] font-medium text-[var(--color-on-surface)] bg-[#f9fafb] border border-[var(--color-outline-variant)]/30 rounded-xl px-4 py-3.5 focus:outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Button 
                type="submit"
                className="w-full min-h-[48px] rounded-xl font-semibold shadow-sm text-[0.9375rem] hover:opacity-90 transition-opacity border-none"
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
              >
                Save Changes
              </Button>
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setIsEditProfileModalOpen(false)}
                className="w-full min-h-[48px] rounded-xl font-semibold border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] hover:bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] text-[0.9375rem]"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
}

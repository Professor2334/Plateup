/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
'use client';
import { toast } from 'sonner';

import { useState, useEffect, useCallback } from 'react';
import { SupportTab } from '@/components/dashboard/SupportTab';
import { PrivacyTab } from '@/components/dashboard/PrivacyTab';
import { TermsTab } from '@/components/dashboard/TermsTab';
import { MealHistoryTab } from '@/components/dashboard/MealHistoryTab';
import { SavedPlansTab } from '@/components/dashboard/SavedPlansTab';
import { GenerateMealForm } from '@/components/meal-plans/GenerateMealForm';
import { MealPlanSkeleton } from '@/components/meal-plans/MealPlanSkeleton';
import type { MealPlanResponse } from '@/lib/deepseek';
import { Button } from '@/components/ui/button';
import { saveMealPlan, deleteMealPlan, generateMealPlan, deleteAllMealPlans } from '@/app/actions/meal-plans/actions';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { History, Bookmark, Settings, LogOut, Calendar, LayoutDashboard, Utensils, Search, User, Lock, Shield, FileText, LifeBuoy, Mail, CheckCircle2, Menu, X } from 'lucide-react';
import { VerificationBanner } from '@/components/dashboard/VerificationBanner';
import { PlateUpLogo } from '@/components/shared/PlateUpLogo';
import { logoutUser } from '@/app/actions/auth/actions';
import { updatePreferences, changePassword, updateProfile } from '@/app/actions/settings/actions';
import { MealPlanResults } from '@/components/meal-plans/MealPlanResults';
import { useMealHistory } from '@/components/dashboard/hooks/useMealHistory';
import { useSettings } from '@/components/dashboard/hooks/useSettings';
import { useMealGeneration } from '@/components/dashboard/hooks/useMealGeneration';

import { MealPlanModel } from '@/types';

interface DashboardClientProps {
  initialHistory: MealPlanModel[];
  userName: string;
  userData: {
    name: string;
    email: string;
    emailVerified: boolean;
    householdSize: string;
    primaryGoal: string;
    receiveWeeklyReminders?: boolean;
    receiveProductUpdates?: boolean;
  };
}

type Tab = 'generate' | 'history' | 'saved' | 'settings' | 'view-plan' | 'support' | 'privacy' | 'terms';

export function DashboardClient({ initialHistory, userName, userData }: DashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const viewParam = searchParams.get('view');


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
  
  const {
    history,
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
  } = useMealHistory(initialHistory);

  const {
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
  } = useMealGeneration({ addPlanToHistory, markPlanAsSaved, setActiveTab });

  const {
    prefSaving, setPrefSaving,
    prefHousehold, setPrefHousehold,
    prefGoal, setPrefGoal,
    weeklyReminders, setWeeklyReminders,
    productUpdates, setProductUpdates,
    passSaving, setPassSaving,
    passError, setPassError,
    passSuccess, setPassSuccess,
    isLogoutModalOpen, setIsLogoutModalOpen,
    isLoggingOut, setIsLoggingOut,
    isEditProfileModalOpen, setIsEditProfileModalOpen
  } = useSettings(
    userData?.householdSize || '1', 
    userData?.primaryGoal || 'save-money',
    userData?.receiveWeeklyReminders ?? true,
    userData?.receiveProductUpdates ?? true
  );

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Prevent body scroll when mobile nav is open
  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileNavOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLogoutModalOpen) {
        setIsLogoutModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLogoutModalOpen]);

  const handleSavePlanById = async (id: string) => {
    const { saveMealPlan } = await import('@/app/actions/meal-plans/actions');
    const res = await saveMealPlan(id);
    if (res.success) {
      markPlanAsSaved(id);
      router.refresh();
      return true;
    }
    return false;
  };

  const shareViaWhatsApp = async (selectedItems?: Set<number>) => {
    if (!generatedPlan) return;
    
    // Dynamically import jspdf to avoid SSR issues
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    
    // 1. Generate PDF
    const doc = new jsPDF();
    
    // Add Title
    doc.setFontSize(20);
    doc.setTextColor(20, 128, 60); // PlateUp Green
    doc.text('PlateUp Weekly Meal Plan', 14, 22);
    
    // Add Subtitle
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Budget: NGN ${activeBudget.toLocaleString()}`, 14, 30);
    
    const minCost = generatedPlan.estimatedCostRange ? generatedPlan.estimatedCostRange.min : generatedPlan.estimatedCost;
    const maxCost = generatedPlan.estimatedCostRange ? generatedPlan.estimatedCostRange.max : Math.round(generatedPlan.estimatedCost * 1.35);
    const minRemaining = Math.max(0, activeBudget - maxCost);
    const maxRemaining = Math.max(0, activeBudget - minCost);

    if (minCost === maxCost) {
      doc.text(`Estimated Shopping Spend: NGN ${minCost.toLocaleString()}`, 14, 36);
      doc.text(`Potential Budget Remaining: NGN ${minRemaining.toLocaleString()}`, 14, 42);
    } else {
      doc.text(`Estimated Shopping Spend: NGN ${minCost.toLocaleString()} - NGN ${maxCost.toLocaleString()}`, 14, 36);
      doc.text(`Potential Budget Remaining: NGN ${minRemaining.toLocaleString()} - NGN ${maxRemaining.toLocaleString()}`, 14, 42);
    }
    
    doc.text(`Ingredients: ${activeIngredients}`, 14, 48);

    // Add Meal Plan Table
    const mealData = generatedPlan.mealPlan.map(day => [
      day.day,
      day.breakfast,
      day.lunch,
      day.dinner
    ]);

    autoTable(doc, {
      startY: 56,
      head: [['Day', 'Breakfast', 'Lunch', 'Dinner']],
      body: mealData,
      theme: 'grid',
      headStyles: { fillColor: [20, 128, 60] },
      styles: { fontSize: 9 },
    });

    // Add Shopping List Title
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalY = (doc as any).lastAutoTable.finalY || 50;
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

    // Add AI Disclaimer Section
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const disclaimerY = (doc as any).lastAutoTable.finalY + 15;
    
    doc.setFontSize(10);
    doc.setTextColor(20, 128, 60);
    doc.text('AI-Generated Guidance', 14, disclaimerY);
    
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const disclaimerText = "This meal plan, shopping list, and budget assessment were generated using artificial intelligence and are intended for planning purposes only. Actual food prices may vary based on location, market conditions, inflation, availability, vendor pricing, and seasonal fluctuations. Please verify ingredient prices and availability before making purchasing decisions. PlateUp does not guarantee the accuracy of AI-generated cost estimates.";
    const splitDisclaimer = doc.splitTextToSize(disclaimerText, 180);
    doc.text(splitDisclaimer, 14, disclaimerY + 6);

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
        <div className="lg:sticky lg:top-6 space-y-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto scrollbar-thin overflow-x-hidden pb-4">
        <GenerateMealForm 
          key={formKey}
          onPlanGenerated={(plan, formData, id) => {
            const b = parseFloat(formData.get('budget') as string);
            const i = formData.get('ingredients') as string;
            handlePlanGenerated(plan, b, i, id);
          }}
          onLoadingChange={setLoading}
          isRegenerating={isRegenerating}
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
          <div className="space-y-6">
            {alternativePlan && (
              <div className="flex bg-[#f9fafb] p-1 rounded-full border border-[var(--color-outline-variant)]/30 self-start inline-flex mb-2">
                <button
                  onClick={() => setActivePlanView('recommended')}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${activePlanView === 'recommended' ? 'bg-white text-[var(--color-primary)] shadow-sm border border-[var(--color-outline-variant)]/20' : 'text-[var(--color-secondary)] hover:text-[var(--color-on-surface)]'}`}
                >
                  Recommended Plan
                </button>
                <button
                  onClick={() => setActivePlanView('budget-friendly')}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${activePlanView === 'budget-friendly' ? 'bg-white text-[var(--color-primary)] shadow-sm border border-[var(--color-outline-variant)]/20' : 'text-[var(--color-secondary)] hover:text-[var(--color-on-surface)]'}`}
                >
                  Budget-Friendly Alternative
                </button>
              </div>
            )}
            <MealPlanResults
              title={activePlanView === 'recommended' ? "Recommended Meal Plan" : "Budget-Friendly Alternative"}
              plan={(activePlanView === 'recommended' ? generatedPlan : alternativePlan) as MealPlanResponse}
              budget={activeBudget}
              ingredients={activeIngredients}
              onSave={handleSavePlan}
              isSaving={saving}
              onShare={shareViaWhatsApp}
              onRegenerate={handleRegeneratePlan}
              isRegenerating={isRegenerating}
              onRegenerateBudgetFriendly={!alternativePlan && activePlanView === 'recommended' ? handleRegenerateBudgetFriendly : undefined}
              isSaved={history.some(p => p.id === (activePlanView === 'recommended' ? activePlanId : activeAlternativePlanId) && p.isSaved)}
            />
          </div>
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



  const renderSettingsTab = () => {
    // Generate initials for avatar
    const initials = userData.name ? userData.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

    return (
      <div className="pb-12 relative w-full">
        {/* Full-width sticky header container */}
        <div className={`sticky top-[-24px] lg:top-[-32px] z-40 -mx-4 px-4 lg:-mx-14 lg:px-14 pt-6 lg:pt-8 pb-4 mb-6 transition-all duration-500 ease-in-out ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.02)]' : 'bg-[#f9fafb]'}`}>
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
              
              <div className="flex flex-col items-center text-center sm:text-left sm:flex-row sm:items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-[color-mix(in_srgb,var(--color-primary)_15%,white)] flex items-center justify-center flex-shrink-0 text-[var(--color-primary)] text-[clamp(1.25rem,2vw+0.5rem,1.5rem)] font-bold tracking-tight">
                  {initials}
                </div>
                <div className="space-y-1.5 flex-1 min-w-0 flex flex-col items-center sm:items-start">
                  <h4 className="text-[clamp(1.125rem,2vw,1.25rem)] font-bold text-[var(--color-on-surface)] w-full truncate">{userData.name}</h4>
                  <p className="text-[0.875rem] text-[var(--color-on-surface-variant)] flex items-center justify-center sm:justify-start gap-2 w-full truncate">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{userData.email}</span>
                  </p>
                  <div className={`mt-2 inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-[0.6875rem] font-bold uppercase tracking-wider ${userData.emailVerified ? 'bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] text-[var(--color-primary)]' : 'bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)] text-[var(--color-error)]'}`}>
                    {userData.emailVerified ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-error)]"></span>
                        Unverified
                      </>
                    )}
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
                  const res = await updatePreferences(prefHousehold, prefGoal, weeklyReminders, productUpdates);
                  setPrefSaving(false);
                  if (res.success) {
                    toast.success('Preferences updated successfully!');
                  } else {
                    toast.error(res.error || 'Failed to update preferences.');
                  }
                }}
                className="space-y-6"
                noValidate
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

                <div className="flex flex-col sm:flex-row justify-between gap-4 pb-4 border-b border-[var(--color-outline-variant)]/20">
                  <div className="flex-1">
                    <label className="text-[0.875rem] font-bold text-[var(--color-on-surface)] mb-1 block">Email Preferences</label>
                    <p className="text-[0.8125rem] text-[var(--color-on-surface-variant)] mb-3 sm:mb-0">Manage the emails you receive from us.</p>
                  </div>
                  <div className="w-full sm:w-48 flex flex-col gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={weeklyReminders}
                        onChange={(e) => setWeeklyReminders(e.target.checked)}
                        className="w-4 h-4 text-[var(--color-primary)] rounded border-gray-300 focus:ring-[var(--color-primary)]"
                      />
                      <span className="text-[0.875rem] text-[var(--color-on-surface)]">Weekly Reminders</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={productUpdates}
                        onChange={(e) => setProductUpdates(e.target.checked)}
                        className="w-4 h-4 text-[var(--color-primary)] rounded border-gray-300 focus:ring-[var(--color-primary)]"
                      />
                      <span className="text-[0.875rem] text-[var(--color-on-surface)]">Product Updates</span>
                    </label>
                  </div>
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
                noValidate
              >
                <div>
                  <label className="text-[0.8125rem] font-bold text-[var(--color-on-surface)] mb-2 block">Change Password</label>
                  <div className="space-y-3">
                    <input 
                      type="password" 
                      name="currentPassword" 
                      placeholder="Current Password" 
                      required
                      className="w-full text-[16px] md:text-[0.875rem] text-[var(--color-on-surface)] bg-[#f9fafb] border border-[var(--color-outline-variant)]/30 rounded-lg px-4 py-2.5 focus:outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all"
                    />
                    <input 
                      type="password" 
                      name="newPassword" 
                      placeholder="New Password" 
                      required
                      className="w-full text-[16px] md:text-[0.875rem] text-[var(--color-on-surface)] bg-[#f9fafb] border border-[var(--color-outline-variant)]/30 rounded-lg px-4 py-2.5 focus:outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all"
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

  const SidebarItem = ({ icon: Icon, label, tab }: { icon: React.ElementType, label: string, tab: Tab }) => (
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
    const scrollTop = e.currentTarget.scrollTop;
    // Hysteresis: activate at 60px scrolled down, deactivate at 20px.
    // This prevents oscillation near the threshold causing the sticky
    // header to shake when the user scrolls near the boundary.
    setIsScrolled(prev => {
      if (!prev && scrollTop > 60) return true;
      if (prev && scrollTop < 20) return false;
      return prev;
    });
  };

  return (
    <>

      {/* Mobile Top App Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-[var(--color-outline-variant)]/10 z-40 flex items-center justify-between px-4 shadow-sm">
        <button onClick={() => setIsMobileNavOpen(true)} className="p-2 -ml-2 text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] rounded-lg transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <PlateUpLogo size="sm" href={null} />
        <div className="w-10"></div> {/* Spacer to center logo */}
      </div>

      {/* Mobile Navigation Drawer Overlay */}
      <div 
        className={`lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${isMobileNavOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileNavOpen(false)}
      />
      
      {/* Mobile Navigation Drawer */}
      <div className={`lg:hidden fixed inset-y-0 left-0 w-[280px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 pt-8 pb-6 border-b border-[var(--color-outline-variant)]/10">
          <PlateUpLogo size="sm" href={null} />
          <button onClick={() => setIsMobileNavOpen(false)} className="p-2 -mr-2 text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-6 py-4">
          <p className="text-[0.8125rem] font-medium text-[var(--color-on-surface-variant)] opacity-80 flex items-center justify-start gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${userData.emailVerified ? 'bg-[#10b981]' : 'bg-[var(--color-accent)]'}`}></span> 
            {userData.emailVerified ? 'Verified Account' : 'Unverified Account'}
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <div onClick={() => setIsMobileNavOpen(false)}><SidebarItem icon={LayoutDashboard} label="Generate Plan" tab="generate" /></div>
          <div onClick={() => setIsMobileNavOpen(false)}><SidebarItem icon={History} label="Meal History" tab="history" /></div>
          <div onClick={() => setIsMobileNavOpen(false)}><SidebarItem icon={Bookmark} label="Saved Plans" tab="saved" /></div>
          <div onClick={() => setIsMobileNavOpen(false)}><SidebarItem icon={Settings} label="Settings" tab="settings" /></div>
        </nav>

        <div className="px-4 pb-8 pt-4 flex flex-col gap-4 border-t border-[var(--color-outline-variant)]/10">
          <button
            onClick={() => { setIsMobileNavOpen(false); setIsLogoutModalOpen(true); }}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-[10px] text-[var(--color-on-surface-variant)] opacity-80 hover:bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] hover:text-[var(--color-error)] hover:opacity-100 transition-all group"
          >
            <LogOut className="w-4 h-4 transition-colors group-hover:text-[var(--color-error)]" />
            <span className="font-medium text-[0.8125rem]">Logout</span>
          </button>

          <div className="flex items-center justify-between gap-1 px-3">
            <button onClick={() => { setIsMobileNavOpen(false); handleTabChange('support'); }} className="text-[0.75rem] font-medium text-[var(--color-on-surface-variant)] opacity-50 hover:text-[var(--color-primary)] hover:opacity-100 transition-all">Contact</button>
            <button onClick={() => { setIsMobileNavOpen(false); handleTabChange('terms'); }} className="text-[0.75rem] font-medium text-[var(--color-on-surface-variant)] opacity-50 hover:text-[var(--color-primary)] hover:opacity-100 transition-all">Terms</button>
            <button onClick={() => { setIsMobileNavOpen(false); handleTabChange('privacy'); }} className="text-[0.75rem] font-medium text-[var(--color-on-surface-variant)] opacity-50 hover:text-[var(--color-primary)] hover:opacity-100 transition-all">Privacy</button>
          </div>
        </div>
      </div>

      <div className={`flex h-screen overflow-hidden bg-[#f9fafb] font-sans transition-all duration-300 ${isLogoutModalOpen ? 'blur-[4px] scale-[0.99] opacity-90' : ''}`}>
        
        {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white shadow-[1px_0_12px_rgba(0,0,0,0.03)] dark:bg-[var(--color-surface-container-low)] flex-col flex-shrink-0 z-10">
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
        className="flex-1 overflow-y-auto px-4 lg:px-14 pb-20 lg:pb-14 pt-20 lg:pt-8 relative w-full"
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
        {activeTab === 'history' && <MealHistoryTab history={history} handleClearAllHistory={requestClearAllHistory} handleSavePlanById={handleSavePlanById} handleDeletePlan={requestDeletePlan} handleTabChange={handleTabChange} isScrolled={isScrolled} />}
        {activeTab === 'saved' && <SavedPlansTab history={history} title="Saved Plans" handleViewOnlyPlan={handleViewOnlyPlan} handleDeletePlan={requestDeletePlan} handleReusePlan={handleReusePlan} handleTabChange={handleTabChange} isScrolled={isScrolled} />}
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
              toast.error(res.error || 'Failed to update profile');
            }
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          }} noValidate>
            <div className="space-y-4 mb-8">
              <div>
                <label className="text-[0.8125rem] font-bold text-[var(--color-on-surface)] mb-2 block">Display Name</label>
                <input 
                  type="text" 
                  name="name" 
                  defaultValue={userData.name}
                  required
                  minLength={2}
                  className="w-full text-[16px] md:text-[0.9375rem] font-medium text-[var(--color-on-surface)] bg-[#f9fafb] border border-[var(--color-outline-variant)]/30 rounded-xl px-4 py-3.5 focus:outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all"
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
    {/* Delete Plan Confirmation Modal */}
    {deleteModalPlanId && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
        <div 
          className="absolute inset-0 bg-[var(--color-background)]/30 backdrop-blur-md transition-opacity duration-300"
          onClick={() => setDeleteModalPlanId(null)}
        />
        <div className="relative bg-[var(--color-surface)] w-full max-w-[360px] rounded-[24px] shadow-[0_16px_40px_rgb(0,0,0,0.12)] p-6 sm:p-8 animate-in zoom-in-95 fade-in duration-200">
          <h3 className="text-[1.25rem] font-bold text-[var(--color-on-surface)] mb-2 tracking-tight">Delete Meal Plan?</h3>
          <p className="text-[0.875rem] text-[var(--color-on-surface-variant)] mb-8 leading-relaxed">
            Are you sure you want to delete this saved plan? This action cannot be undone.
          </p>
          <div className="flex flex-col gap-3">
            <Button 
              onClick={confirmDeletePlan}
              className="w-full min-h-[48px] rounded-xl font-semibold shadow-sm text-[0.9375rem] hover:opacity-90 transition-opacity border-none disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-error)', color: 'var(--color-on-error)' }}
            >
              Delete Plan
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setDeleteModalPlanId(null)}
              className="w-full min-h-[48px] rounded-xl font-semibold border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] hover:bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] text-[0.9375rem]"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    )}

    {/* Clear All History Confirmation Modal */}
    {isClearAllModalOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
        <div 
          className="absolute inset-0 bg-[var(--color-background)]/30 backdrop-blur-md transition-opacity duration-300"
          onClick={() => setIsClearAllModalOpen(false)}
        />
        <div className="relative bg-[var(--color-surface)] w-full max-w-[360px] rounded-[24px] shadow-[0_16px_40px_rgb(0,0,0,0.12)] p-6 sm:p-8 animate-in zoom-in-95 fade-in duration-200">
          <h3 className="text-[1.25rem] font-bold text-[var(--color-on-surface)] mb-2 tracking-tight">Clear All History?</h3>
          <p className="text-[0.875rem] text-[var(--color-on-surface-variant)] mb-8 leading-relaxed">
            Are you sure you want to delete ALL meal plans from your history? This action cannot be undone.
          </p>
          <div className="flex flex-col gap-3">
            <Button 
              onClick={confirmClearAllHistory}
              className="w-full min-h-[48px] rounded-xl font-semibold shadow-sm text-[0.9375rem] hover:opacity-90 transition-opacity border-none disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-error)', color: 'var(--color-on-error)' }}
            >
              Clear History
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsClearAllModalOpen(false)}
              className="w-full min-h-[48px] rounded-xl font-semibold border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] hover:bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] text-[0.9375rem]"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

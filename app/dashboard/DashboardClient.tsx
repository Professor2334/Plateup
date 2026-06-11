'use client';

import { useState, useEffect } from 'react';
import { GenerateMealForm } from '@/components/meal-plans/GenerateMealForm';
import { MealPlanSkeleton } from '@/components/meal-plans/MealPlanSkeleton';
import type { MealPlanResponse } from '@/lib/deepseek';
import { Button } from '@/components/ui/button';
import { saveMealPlan, deleteMealPlan } from '@/app/actions/meal-plans/actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { History, Bookmark, Settings, LogOut, Calendar, LayoutDashboard } from 'lucide-react';
import { VerificationBanner } from '@/components/dashboard/VerificationBanner';
import { PlateUpLogo } from '@/components/shared/PlateUpLogo';
import { logoutUser } from '@/app/actions/auth/actions';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { updatePreferences, changePassword } from '@/app/actions/settings/actions';

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

type Tab = 'generate' | 'history' | 'saved' | 'settings' | 'view-plan';

export function DashboardClient({ initialHistory, userName, userData }: DashboardClientProps) {
  const [history, setHistory] = useState(initialHistory);
  const [activeTab, setActiveTab] = useState<Tab>('generate');
  
  useEffect(() => {
    setHistory(initialHistory);
  }, [initialHistory]);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLogoutModalOpen) {
        setIsLogoutModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLogoutModalOpen]);

  const router = useRouter();

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
    setActiveTab('generate');
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
    setActiveTab('view-plan');
  };

  const shareViaWhatsApp = async () => {
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
    const shoppingData = generatedPlan.shoppingList.map(item => [
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
        <div className="lg:sticky lg:top-4 space-y-6">
          <div>
          <h2 className="text-2xl font-bold text-[var(--color-on-surface)]">Plan Your Week</h2>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Enter your budget and ingredients to get started.</p>
        </div>
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
            <h1 className="text-2xl font-bold text-[var(--color-primary)]">Generating your meal plan...</h1>
            <p className="text-[var(--color-on-surface-variant)]">This takes about 10-15 seconds. Hang tight!</p>
            <MealPlanSkeleton />
          </div>
        ) : generatedPlan ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[var(--color-primary)]">Your Meal Plan</h1>
                <div className="flex items-center flex-wrap gap-3 mt-1.5">
                  <p className="text-[var(--color-on-surface-variant)]">
                    Budget: NGN {activeBudget.toLocaleString()}
                  </p>
                  <span className="px-3 py-1 bg-[var(--color-primary-container)] text-[var(--color-primary)] rounded-full text-sm font-medium tracking-wide border border-[var(--color-primary)] border-opacity-20">
                    {generatedPlan.budgetStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={shareViaWhatsApp}>Share via WhatsApp</Button>
                <Button onClick={handleSavePlan} disabled={saving}>{saving ? 'Saving...' : 'Save Plan'}</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedPlan.mealPlan.map((dayPlan, idx) => (
                <div key={idx} className="border border-[var(--color-outline-variant)] rounded-lg p-4 space-y-3 bg-[var(--color-surface)]">
                  <h3 className="font-bold text-[var(--color-primary)] border-b pb-2">{dayPlan.day}</h3>
                  <div className="text-sm">
                    <span className="font-semibold block text-[var(--color-secondary)]">Breakfast</span>
                    <span className="text-[var(--color-on-surface)]">{dayPlan.breakfast}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold block text-[var(--color-secondary)]">Lunch</span>
                    <span className="text-[var(--color-on-surface)]">{dayPlan.lunch}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold block text-[var(--color-secondary)]">Dinner</span>
                    <span className="text-[var(--color-on-surface)]">{dayPlan.dinner}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border border-[var(--color-outline-variant)] rounded-lg p-6 bg-[var(--color-surface)] mt-8">
              <h2 className="text-xl font-bold text-[var(--color-primary)] mb-4">Shopping List</h2>
              <ul className="space-y-2 list-disc list-inside">
                {generatedPlan.shoppingList.map((item, idx) => (
                  <li key={idx} className="text-sm text-[var(--color-on-surface)]">
                    <span className="font-medium">{item.item}</span> - {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--color-outline-variant)] bg-[var(--color-surface-lowest)] p-12 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
            <h3 className="text-lg font-medium text-[var(--color-on-surface-variant)]">No meal plan active</h3>
            <p className="mt-1 text-sm text-[var(--color-on-surface-variant)] opacity-80">
              Use the form on the left to generate a new 7-day budget-aware Nigerian meal plan.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderHistoryTab = () => {
    // Group history by date
    const groups: Record<string, any[]> = {
      'Today': [],
      'Yesterday': [],
      'Earlier This Week': [],
      'Older': []
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    history.forEach((plan: any) => {
      const d = new Date(plan.createdAt);
      if (d >= today) {
        groups['Today'].push(plan);
      } else if (d >= yesterday && d < today) {
        groups['Yesterday'].push(plan);
      } else if (d >= oneWeekAgo && d < yesterday) {
        groups['Earlier This Week'].push(plan);
      } else {
        groups['Older'].push(plan);
      }
    });

    return (
      <div className="max-w-4xl space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-[var(--color-on-surface)] tracking-tight">Meal History</h2>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-2">A timeline of all your generated meal plans.</p>
        </div>
        
        {history.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-20 flex flex-col items-center justify-center text-center">
            <History className="w-12 h-12 text-[var(--color-outline-variant)] mb-4" />
            <h3 className="text-xl font-semibold text-[var(--color-on-surface)]">No activity yet</h3>
            <p className="text-[var(--color-on-surface-variant)] mt-2">Your timeline will populate once you generate your first meal plan.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(groups).map(([groupName, plans]) => {
              if (plans.length === 0) return null;
              return (
                <div key={groupName} className="relative">
                  <div className="sticky top-0 bg-[var(--color-surface-lowest)] z-10 py-3 border-b border-[var(--color-outline-variant)]">
                    <h3 className="text-[11px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">{groupName}</h3>
                  </div>
                  <div className="mt-2 space-y-1">
                    {plans.map((plan: any) => {
                      const time = new Date(plan.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                      
                      return (
                        <div key={plan.id} className="group relative flex flex-col sm:flex-row sm:items-start py-3 hover:bg-[var(--color-surface)] transition-colors px-4 -mx-4 rounded-xl gap-2 sm:gap-0">
                          {/* Time */}
                          <div className="w-24 pt-0.5 flex-shrink-0 text-[13px] font-medium text-[var(--color-secondary)]">
                            {time}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center flex-wrap gap-2">
                              <span className="text-sm text-[var(--color-on-surface)]">
                                Generated a <span className="font-semibold">7-day</span> meal plan for
                              </span>
                              <span className="text-sm font-semibold text-[var(--color-on-surface)]">
                                NGN {plan.budget.toLocaleString()}
                              </span>
                              {plan.isSaved ? (
                                <span className="text-[10px] font-bold text-[var(--color-on-primary-container)] bg-[var(--color-primary-container)] px-2 py-0.5 rounded uppercase tracking-wider ml-1">Saved</span>
                              ) : (
                                <span className="text-[10px] font-bold text-[var(--color-secondary)] bg-[var(--color-surface-container-high)] px-2 py-0.5 rounded uppercase tracking-wider ml-1">Unsaved</span>
                              )}
                            </div>
                            <p className="text-sm text-[var(--color-on-surface-variant)] mt-1 truncate">
                              Using: {plan.ingredients}
                            </p>
                          </div>

                          {/* Actions - visible on hover (desktop) or always (mobile) */}
                          <div className="flex gap-4 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity pt-2 sm:pt-0">
                            <button onClick={() => handleViewOnlyPlan(plan)} className="text-[13px] font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">View</button>
                            {!plan.isSaved && (
                              <button onClick={() => handleSavePlanById(plan.id)} className="text-[13px] font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">Save</button>
                            )}
                            <button onClick={() => handleDeletePlan(plan.id)} className="text-[13px] font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-error)] transition-colors">Delete</button>
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
    );
  };

  const renderSavedTab = (title: string) => {
    const savedPlans = history.filter(p => p.isSaved);
    
    return (
    <div className="max-w-6xl space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[var(--color-on-surface)] tracking-tight">{title}</h2>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-2">Manage and reuse your previously generated meal plans.</p>
        </div>
      </div>
      
      {savedPlans.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-20 flex flex-col items-center justify-center text-center">
          <Bookmark className="w-12 h-12 text-[var(--color-outline-variant)] mb-4" />
          <h3 className="text-xl font-semibold text-[var(--color-on-surface)]">No saved plans yet</h3>
          <p className="text-[var(--color-on-surface-variant)] mt-2 max-w-md">Your saved meal plans will appear here. Generate a plan and click save to keep it for later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedPlans.map((plan: any) => {
            const date = new Date(plan.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            const previewMeals = plan.generatedPlan?.slice(0, 2) || [];
            
            return (
              <div key={plan.id} className="rounded-2xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)] flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 group hover:border-[var(--color-primary)]">
                {/* Header */}
                <div className="p-6 border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] flex justify-between items-start">
                  <div>
                    <span className="inline-flex items-center rounded-full bg-[var(--color-primary-container)] px-2.5 py-0.5 text-xs font-semibold text-[var(--color-on-primary-container)] mb-3">
                      7 Days
                    </span>
                    <h3 className="text-2xl font-extrabold text-[var(--color-primary)]">NGN {plan.budget.toLocaleString()}</h3>
                    <p className="text-xs font-medium text-[var(--color-on-surface-variant)] mt-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Saved on {date}
                    </p>
                  </div>
                </div>

                {/* Body Preview */}
                <div className="p-6 flex-1 space-y-5">
                  <div>
                    <h4 className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">Ingredients</h4>
                    <p className="text-sm text-[var(--color-on-surface)] line-clamp-2 leading-relaxed">{plan.ingredients}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">Preview</h4>
                    <div className="space-y-2">
                      {previewMeals.map((day: any, i: number) => (
                        <div key={i} className="text-sm flex gap-3">
                          <span className="font-bold text-[var(--color-primary)] w-8 flex-shrink-0">{day.day.substring(0, 3)}</span>
                          <span className="text-[var(--color-on-surface-variant)] truncate">{day.lunch}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    className="w-full text-xs h-9 px-2 shadow-sm"
                    onClick={() => handleViewOnlyPlan(plan)}
                  >
                    View
                  </Button>
                  <Button 
                    variant="primary" 
                    className="w-full text-xs h-9 px-2 shadow-sm"
                    onClick={() => handleReusePlan(plan)}
                  >
                    Reuse
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full text-xs h-9 px-2 text-[var(--color-error)] hover:bg-[var(--color-error-container)] hover:text-[var(--color-error)] border-[var(--color-error)] border-opacity-20 hover:border-opacity-100 transition-colors shadow-sm"
                    onClick={() => handleDeletePlan(plan.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
  };

  const renderSettingsTab = () => {
    return (
    <div className="max-w-3xl space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-bold text-[var(--color-on-surface)] tracking-tight">Settings</h2>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-2">Manage your account settings and preferences.</p>
      </div>

      {/* Profile Section */}
      <div className="rounded-2xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)] overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)]">
          <h3 className="text-lg font-bold text-[var(--color-on-surface)]">Profile</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2 block">Name</label>
              <div className="text-sm font-medium text-[var(--color-on-surface)] bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-lg px-4 py-3">{userData.name}</div>
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2 block">Email</label>
              <div className="text-sm font-medium text-[var(--color-on-surface)] bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-lg px-4 py-3">{userData.email}</div>
            </div>
          </div>
          <div>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${userData.emailVerified ? 'bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]' : 'bg-[var(--color-error-container)] text-[var(--color-error)]'}`}>
              {userData.emailVerified ? 'Email Verified' : 'Email Not Verified'}
            </span>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="rounded-2xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)] overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)]">
          <h3 className="text-lg font-bold text-[var(--color-on-surface)]">Preferences</h3>
        </div>
        <form 
          className="p-6 space-y-6"
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
        >
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2 block">Household Size</label>
              <select 
                value={prefHousehold}
                onChange={e => setPrefHousehold(e.target.value)}
                className="w-full sm:w-1/2 text-sm font-medium text-[var(--color-on-surface)] bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-shadow"
              >
                <option value="1">1 Person</option>
                <option value="2">2 People</option>
                <option value="3-4">3-4 People</option>
                <option value="5+">5+ People</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2 block">Primary Goal</label>
              <select 
                value={prefGoal}
                onChange={e => setPrefGoal(e.target.value)}
                className="w-full sm:w-1/2 text-sm font-medium text-[var(--color-on-surface)] bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-shadow"
              >
                <option value="save-money">Save Money</option>
                <option value="save-time">Save Time</option>
                <option value="reduce-waste">Reduce Food Waste</option>
                <option value="eat-healthier">Eat Healthier</option>
              </select>
            </div>
          </div>
          <div className="pt-2 border-t border-[var(--color-outline-variant)]">
            <Button type="submit" variant="primary" disabled={prefSaving}>{prefSaving ? 'Saving...' : 'Update Preferences'}</Button>
          </div>
        </form>
      </div>

      {/* Support Section */}
      <div className="rounded-2xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)] overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)]">
          <h3 className="text-lg font-bold text-[var(--color-on-surface)]">Support & Legal</h3>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
            Need help with your account or meal plans? Send us a message and we'll get back to you within 1-2 business days.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link href="/contact" className="inline-flex items-center justify-center h-10 px-5 rounded-lg bg-[var(--color-primary-container)] text-[var(--color-primary)] text-sm font-bold hover:opacity-90 transition-opacity">
              Contact Us
            </Link>
            <Link href="/terms" className="inline-flex items-center justify-center h-10 px-5 rounded-lg border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] text-sm font-bold hover:bg-[var(--color-surface-container-low)] transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="inline-flex items-center justify-center h-10 px-5 rounded-lg border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] text-sm font-bold hover:bg-[var(--color-surface-container-low)] transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Account Section */}
      <div className="rounded-2xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)] overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)]">
          <h3 className="text-lg font-bold text-[var(--color-error)]">Account</h3>
        </div>
        <div className="p-6 space-y-8">
          <form 
            className="space-y-5"
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
            <h4 className="text-sm font-semibold text-[var(--color-on-surface)]">Change Password</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input 
                type="password" 
                name="currentPassword" 
                placeholder="Current Password" 
                required
                className="w-full text-sm text-[var(--color-on-surface)] bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-shadow"
              />
              <input 
                type="password" 
                name="newPassword" 
                placeholder="New Password" 
                required
                className="w-full text-sm text-[var(--color-on-surface)] bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-shadow"
              />
            </div>
            {passError && <p className="text-xs font-semibold text-[var(--color-error)] mt-2">{passError}</p>}
            {passSuccess && <p className="text-xs font-semibold text-[var(--color-primary)] mt-2">{passSuccess}</p>}
            <div className="pt-2">
              <Button type="submit" variant="outline" disabled={passSaving}>{passSaving ? 'Updating...' : 'Update Password'}</Button>
            </div>
          </form>

          <div className="pt-6 border-t border-[var(--color-outline-variant)]">
            <h4 className="text-sm font-semibold text-[var(--color-on-surface)] mb-2">Sign Out</h4>
            <p className="text-xs text-[var(--color-on-surface-variant)] mb-5">Sign out of your account on this device.</p>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="text-sm font-bold bg-[var(--color-error)] text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
    );
  };

  const SidebarItem = ({ icon: Icon, label, tab }: { icon: any, label: string, tab: Tab }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
        activeTab === tab 
          ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm font-semibold' 
          : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-on-surface)] font-medium'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <>
      <div className={`flex h-screen overflow-hidden bg-[var(--color-surface-lowest)] font-sans transition-all duration-300 ${isLogoutModalOpen ? 'blur-[4px] scale-[0.99] opacity-90' : ''}`}>
        {/* Sidebar */}
      <aside className="w-64 border-r border-[var(--color-outline-variant)] bg-[var(--color-surface)] flex flex-col flex-shrink-0 z-10 shadow-sm">
        <div className="p-8 pb-6">
          <PlateUpLogo size="lg" href={null} />
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-2 font-medium">Welcome, {userName}</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem icon={LayoutDashboard} label="Generate Plan" tab="generate" />
          <SidebarItem icon={History} label="Meal History" tab="history" />
          <SidebarItem icon={Bookmark} label="Saved Plans" tab="saved" />
          <SidebarItem icon={Settings} label="Settings" tab="settings" />
        </nav>
        <div className="p-6 border-t border-[var(--color-outline-variant)]">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-[var(--color-error)] hover:bg-[var(--color-error-container)]/60 transition-colors mb-4"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold text-sm">Logout</span>
          </button>
          <div className="px-2 space-y-2">
            <Link href="/contact" className="block text-[13px] font-normal text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">Contact Us</Link>
            <Link href="/terms" className="block text-[13px] font-normal text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="block text-[13px] font-normal text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-10 lg:p-14">
        {/* Verification banner — only shown to unverified users */}
        {!userData.emailVerified && (
          <div className="mb-8">
            <VerificationBanner email={userData.email} />
          </div>
        )}
        {activeTab === 'generate' && renderGenerateTab()}
        {activeTab === 'view-plan' && (
          <div className="max-w-5xl space-y-6">
            <button onClick={() => setActiveTab('history')} className="text-sm font-medium text-[var(--color-primary)] hover:underline mb-4 flex items-center gap-1">
              &larr; Back to History
            </button>
            <div className="bg-[var(--color-surface)] p-8 rounded-2xl border border-[var(--color-outline-variant)] shadow-sm">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-[var(--color-primary)]">Meal Plan Viewer</h1>
                  <p className="text-[var(--color-on-surface-variant)] mt-2">Budget: NGN {activeBudget.toLocaleString()} | Ingredients: {activeIngredients}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={shareViaWhatsApp}>Share via WhatsApp</Button>
                  <Button onClick={() => setActiveTab('generate')}>Load into Workspace</Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {generatedPlan?.mealPlan.map((dayPlan, idx) => (
                  <div key={idx} className="border border-[var(--color-outline-variant)] rounded-xl p-5 space-y-4 bg-[var(--color-surface-container-lowest)]">
                    <h3 className="font-bold text-lg text-[var(--color-primary)] border-b pb-3">{dayPlan.day}</h3>
                    <div className="text-sm">
                      <span className="font-bold text-[var(--color-secondary)] block mb-1">Breakfast</span>
                      <span className="text-[var(--color-on-surface)]">{dayPlan.breakfast}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-bold text-[var(--color-secondary)] block mb-1">Lunch</span>
                      <span className="text-[var(--color-on-surface)]">{dayPlan.lunch}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-bold text-[var(--color-secondary)] block mb-1">Dinner</span>
                      <span className="text-[var(--color-on-surface)]">{dayPlan.dinner}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'history' && renderHistoryTab()}
        {activeTab === 'saved' && renderSavedTab('Saved Plans')}
        {activeTab === 'settings' && renderSettingsTab()}
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
          <h3 className="text-[20px] font-bold text-[var(--color-on-surface)] mb-2 tracking-tight">Log out of PlateUp?</h3>
          <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-8 leading-relaxed">
            You'll need to sign in again to access your meal plans and saved history.
          </p>
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => logoutUser()}
              className="w-full min-h-[48px] rounded-xl font-semibold shadow-sm text-[15px] hover:opacity-90 transition-opacity border-none"
              style={{ backgroundColor: 'var(--color-error)', color: 'var(--color-on-error)' }}
            >
              Logout
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsLogoutModalOpen(false)}
              className="w-full min-h-[48px] rounded-xl font-semibold border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] hover:bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] text-[15px]"
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

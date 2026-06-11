'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { completeOnboarding } from '@/app/actions/onboarding/actions';
import { useRouter } from 'next/navigation';
import { Check, ArrowRight, ArrowLeft, User, Users, Banknote, Clock, Leaf, HeartPulse, Loader2, Sparkles, PartyPopper } from 'lucide-react';
import Lottie from 'lottie-react';
import confettiAnimation from '@/public/confetti.json';
import { PlateUpLogo } from '@/components/shared/PlateUpLogo';

const householdSizes = [
  { value: '1', label: '1 Person', icon: User, description: 'Perfect for solo planning' },
  { value: '2', label: '2 People', icon: Users, description: 'Ideal for couples' },
  { value: '3-4', label: '3-4 People', icon: Users, description: 'Growing household' },
  { value: '5+', label: '5+ People', icon: Users, description: 'Large family meals' },
];

const primaryGoals = [
  { value: 'save-money', label: 'Save Money', icon: Banknote, description: 'Reduce grocery bills' },
  { value: 'save-time', label: 'Save Time', icon: Clock, description: 'Spend less time cooking' },
  { value: 'reduce-waste', label: 'Reduce Waste', icon: Leaf, description: 'Use all ingredients' },
  { value: 'eat-healthier', label: 'Eat Healthier', icon: HeartPulse, description: 'Balanced nutrition' },
];

export function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [householdSize, setHouseholdSize] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // For smooth transitions
  const [isAnimating, setIsAnimating] = useState(false);
  
  const changeStep = (newStep: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setStep(newStep);
      setIsAnimating(false);
    }, 250); // Matches the CSS transition duration
  };

  const handleNextStep1 = () => {
    if (householdSize) changeStep(2);
  };

  const handleComplete = async () => {
    if (!householdSize || !primaryGoal) return;
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('householdSize', householdSize);
    formData.append('primaryGoal', primaryGoal);

    const result = await completeOnboarding(formData);

    if (result && !result.success) {
      setError(result.error || 'Failed to complete onboarding');
      setLoading(false);
    } else {
      // Show lightweight success screen instead of immediate redirect
      changeStep(3);
      setLoading(false);
    }
  };

  const handleGenerateMealPlan = () => {
    setLoading(true);
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="w-full">
      
      {/* ── Brand logo — top-left edge of the page ── */}
      <div className="absolute top-6 left-6 md:top-8 md:left-10 z-50">
        <PlateUpLogo size="md" href="/" />
      </div>

      {/* Progress Bar Header */}
      {step < 3 && (
        <div className="mb-10 max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-[var(--color-on-surface)]">Personalize PlateUp</span>
            <span className="text-sm font-medium text-[var(--color-on-surface-variant)]">Step {step} of 2</span>
          </div>
          <div className="w-full h-1.5 bg-[var(--color-surface-container-highest)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[var(--color-primary)] transition-all duration-500 ease-in-out"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Content Area with Transition */}
      <div 
        className={`transition-all duration-250 ease-in-out transform ${
          isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
      >
        
        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-6 max-w-lg mx-auto">
            <div className="text-center sm:text-left">
              <h2 className="text-[28px] font-bold text-[var(--color-on-surface-variant)] mb-1 tracking-tight">What is your household size?</h2>
              <p className="text-[16px] text-[var(--color-on-surface-variant)] opacity-70">This helps the AI scale your recipes and shopping lists correctly.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {householdSizes.map((size) => {
                const isSelected = householdSize === size.value;
                const Icon = size.icon;
                return (
                  <button
                    key={size.value}
                    onClick={() => setHouseholdSize(size.value)}
                    className={`group relative p-5 text-left rounded-2xl transition-all duration-300 flex flex-col gap-4 focus:outline-none cursor-pointer hover:-translate-y-1
                      ${isSelected 
                        ? 'border-2 border-[var(--color-primary)] bg-[var(--color-primary)]/10 shadow-[0_8px_20px_0_rgba(17,94,59,0.15)] scale-[1.01]' 
                        : 'border-2 border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] bg-[var(--color-surface)] hover:border-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] hover:bg-[var(--color-surface-container-low)] hover:shadow-sm'
                      }
                    `}
                  >
                    {/* Top Right Checkmark Badge */}
                    <div className={`absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-[var(--color-primary)] text-white scale-100 opacity-100 shadow-sm' : 'bg-transparent text-transparent scale-50 opacity-0'}`}>
                      <Check className="w-4 h-4" strokeWidth={3} />
                    </div>

                    <div className="flex items-center w-full">
                      <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] transition-transform duration-300 group-hover:scale-105">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div>
                      <h3 className={`font-bold text-[17px] mb-1 transition-colors duration-300 ${isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface)]'}`}>{size.label}</h3>
                      <p className="text-[14px] text-[var(--color-on-surface-variant)] font-medium">{size.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <Button 
                onClick={handleNextStep1} 
                disabled={!householdSize}
                className="w-full min-h-[56px] text-[16px] font-semibold rounded-xl"
              >
                Continue <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-6 max-w-lg mx-auto">
            <div className="text-center sm:text-left">
              <h2 className="text-[28px] font-bold text-[var(--color-on-surface-variant)] mb-1 tracking-tight">What is your primary goal?</h2>
              <p className="text-[16px] text-[var(--color-on-surface-variant)] opacity-70">We'll optimize your meal plans to help you achieve this objective.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {primaryGoals.map((goal) => {
                const isSelected = primaryGoal === goal.value;
                const Icon = goal.icon;
                return (
                  <button
                    key={goal.value}
                    onClick={() => setPrimaryGoal(goal.value)}
                    className={`group relative p-5 text-left rounded-2xl transition-all duration-300 flex flex-col gap-4 focus:outline-none cursor-pointer hover:-translate-y-1
                      ${isSelected 
                        ? 'border-2 border-[var(--color-primary)] bg-[var(--color-primary)]/10 shadow-[0_8px_20px_0_rgba(17,94,59,0.15)] scale-[1.01]' 
                        : 'border-2 border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] bg-[var(--color-surface)] hover:border-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] hover:bg-[var(--color-surface-container-low)] hover:shadow-sm'
                      }
                    `}
                  >
                    {/* Top Right Checkmark Badge */}
                    <div className={`absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-[var(--color-primary)] text-white scale-100 opacity-100 shadow-sm' : 'bg-transparent text-transparent scale-50 opacity-0'}`}>
                      <Check className="w-4 h-4" strokeWidth={3} />
                    </div>

                    <div className="flex items-center w-full">
                      <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] transition-transform duration-300 group-hover:scale-105">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div>
                      <h3 className={`font-bold text-[17px] mb-1 transition-colors duration-300 ${isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface)]'}`}>{goal.label}</h3>
                      <p className="text-[14px] text-[var(--color-on-surface-variant)] font-medium">{goal.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {error && <p className="text-[var(--color-error)] text-sm text-center font-medium bg-[var(--color-error)]/10 p-3 rounded-lg">{error}</p>}

            <div className="pt-2 flex flex-col gap-4">
              <Button 
                onClick={handleComplete} 
                disabled={!primaryGoal || loading}
                className="w-full min-h-[56px] text-[16px] font-semibold rounded-xl"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Complete Setup'}
              </Button>
              
              <button 
                onClick={() => changeStep(1)}
                disabled={loading}
                className="inline-flex items-center justify-center gap-1.5 text-[14px] font-medium text-[var(--color-on-surface-variant)] opacity-70 hover:opacity-100 hover:text-[var(--color-on-surface)] transition-all mx-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-md px-2 py-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 - SUCCESS */}
        {step === 3 && (
          <div className="flex flex-col items-center justify-center py-2 w-full max-w-[560px] mx-auto">
            <div className="w-full text-center">
              
              {/* Celebration header */}
              <div className="flex flex-col items-center pt-2 relative">
                {/* Confetti Burst (Plays once) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] pointer-events-none z-50 flex justify-center -mt-32">
                  <Lottie 
                    animationData={confettiAnimation} 
                    loop={false} 
                    autoplay={true} 
                  />
                </div>

                <div className="relative flex justify-center items-center w-28 h-28 text-[var(--color-primary)] animate-float z-10 mb-3">
                  <PartyPopper className="w-20 h-20 animate-rock origin-bottom" strokeWidth={1.5} />
                  <Sparkles className="w-8 h-8 absolute top-0 right-0 animate-pulse text-[var(--color-accent)]" />
                  <Sparkles className="w-5 h-5 absolute bottom-4 -left-2 animate-pulse text-[var(--color-accent)] opacity-70" style={{ animationDelay: '500ms' }} />
                </div>
                
                <div className="space-y-2">
                  <span className="inline-flex items-center justify-center px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-primary)]/10 rounded-full mb-1">
                    Setup Complete
                  </span>
                  <h2 className="text-[32px] md:text-[36px] font-extrabold text-[var(--color-on-surface-variant)] leading-tight tracking-tight">
                    You're Ready to Start Planning
                  </h2>
                  <p className="text-[16px] text-[var(--color-on-surface-variant)] opacity-70 leading-relaxed max-w-sm mx-auto">
                    We'll now generate personalized Nigerian meal plans tailored to your household.
                  </p>
                </div>
              </div>

              {/* Compact Summary Section */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto w-full">
                <div className="flex-1 w-full p-4 rounded-xl border border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] bg-[var(--color-surface)] shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-[13px] font-medium text-[var(--color-on-surface-variant)] mb-1 flex items-center gap-1.5">
                    🏠 Household Size
                  </span>
                  <span className="text-[16px] font-semibold text-[var(--color-on-surface)]">
                    {householdSizes.find(s => s.value === householdSize)?.label}
                  </span>
                </div>
                <div className="flex-1 w-full p-4 rounded-xl border border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] bg-[var(--color-surface)] shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-[13px] font-medium text-[var(--color-on-surface-variant)] mb-1 flex items-center gap-1.5">
                    🎯 Primary Goal
                  </span>
                  <span className="text-[16px] font-semibold text-[var(--color-on-surface)]">
                    {primaryGoals.find(g => g.value === primaryGoal)?.label}
                  </span>
                </div>
              </div>

              {/* Benefits Checklist */}
              <div className="mt-6 max-w-sm mx-auto flex flex-col items-start pl-4 sm:pl-8">
                <div className="space-y-3">
                  {[
                    'Smart Shopping Lists',
                    'Budget-Aware Recommendations',
                    'Ingredient Optimization',
                    'Save & Reuse Meal Plans',
                    'WhatsApp Sharing'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-[var(--color-primary)]" strokeWidth={3} />
                      </div>
                      <span className="text-[15px] font-medium text-[var(--color-on-surface)]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* CTA */}
              <div className="mt-8 w-full max-w-md mx-auto flex flex-col items-center">
                <Button 
                  onClick={handleGenerateMealPlan}
                  disabled={loading}
                  className="w-full min-h-[60px] text-[18px] font-semibold rounded-xl bg-[var(--color-primary)] text-white shadow-[0_8px_20px_0_rgba(17,94,59,0.25)] hover:shadow-[0_8px_25px_rgba(17,94,59,0.35)] hover:-translate-y-0.5 transition-all"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Generate My First Meal Plan <ArrowRight className="w-5 h-5 ml-2.5" /></>}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

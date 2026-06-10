'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { completeOnboarding } from '@/app/actions/onboarding/actions';
import { useRouter } from 'next/navigation';
import { Check, ArrowRight, ArrowLeft, User, Users, Banknote, Clock, Leaf, HeartPulse, Loader2, Sparkles } from 'lucide-react';
import Lottie from 'lottie-react';
import confettiAnimation from '@/public/confetti.json';

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
      
      {/* Progress Bar Header */}
      {step < 3 && (
        <div className="mb-10 max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-[var(--color-on-surface)]">Personalize PlateUp</span>
            <span className="text-sm font-medium text-[var(--color-on-surface-variant)]">Step {step} of 2</span>
          </div>
          <div className="w-full h-2 bg-[var(--color-surface-container-highest)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[var(--color-primary)] transition-all duration-700 ease-out"
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
          <div className="space-y-8 max-w-lg mx-auto">
            <div className="text-center sm:text-left">
              <h2 className="text-[28px] font-bold text-[var(--color-on-surface)] mb-2 leading-tight tracking-tight">What is your household size?</h2>
              <p className="text-[16px] text-[var(--color-on-surface-variant)] opacity-80 leading-relaxed">This helps the AI scale your recipes and shopping lists correctly.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {householdSizes.map((size) => {
                const isSelected = householdSize === size.value;
                const Icon = size.icon;
                return (
                  <button
                    key={size.value}
                    onClick={() => setHouseholdSize(size.value)}
                    className={`group relative p-5 text-left border rounded-2xl transition-all duration-300 flex flex-col gap-4 focus:outline-none cursor-pointer hover:-translate-y-1
                      ${isSelected 
                        ? 'border-[var(--color-secondary)] bg-[var(--color-primary)]/5 shadow-[0_8px_20px_0_rgba(17,94,59,0.12)] scale-[1.02]' 
                        : 'border-[color-mix(in_srgb,var(--color-outline-variant)_70%,transparent)] bg-[var(--color-surface)] hover:border-[var(--color-secondary)] hover:bg-[var(--color-surface-container-low)] hover:shadow-sm'
                      }
                    `}
                  >
                    {/* Top Right Checkmark Badge */}
                    <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-[var(--color-primary)] text-white scale-100 opacity-100' : 'bg-transparent text-transparent scale-50 opacity-0'}`}>
                      <Check className="w-3.5 h-3.5" strokeWidth={4} />
                    </div>

                    <div className="flex items-center w-full">
                      <div className="w-14 h-14 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] transition-transform duration-300 group-hover:scale-105">
                        <Icon className="w-7 h-7" />
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

            <div className="pt-4">
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
          <div className="space-y-8 max-w-lg mx-auto">
            <div className="text-center sm:text-left">
              <h2 className="text-[28px] font-bold text-[var(--color-on-surface)] mb-2 leading-tight tracking-tight">What is your primary goal?</h2>
              <p className="text-[16px] text-[var(--color-on-surface-variant)] opacity-80 leading-relaxed">We'll optimize your meal plans to help you achieve this objective.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {primaryGoals.map((goal) => {
                const isSelected = primaryGoal === goal.value;
                const Icon = goal.icon;
                return (
                  <button
                    key={goal.value}
                    onClick={() => setPrimaryGoal(goal.value)}
                    className={`group relative p-5 text-left border rounded-2xl transition-all duration-300 flex flex-col gap-4 focus:outline-none cursor-pointer hover:-translate-y-1
                      ${isSelected 
                        ? 'border-[var(--color-secondary)] bg-[var(--color-primary)]/5 shadow-[0_8px_20px_0_rgba(17,94,59,0.12)] scale-[1.02]' 
                        : 'border-[color-mix(in_srgb,var(--color-outline-variant)_70%,transparent)] bg-[var(--color-surface)] hover:border-[var(--color-secondary)] hover:bg-[var(--color-surface-container-low)] hover:shadow-sm'
                      }
                    `}
                  >
                    {/* Top Right Checkmark Badge */}
                    <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-[var(--color-primary)] text-white scale-100 opacity-100' : 'bg-transparent text-transparent scale-50 opacity-0'}`}>
                      <Check className="w-3.5 h-3.5" strokeWidth={4} />
                    </div>

                    <div className="flex items-center w-full">
                      <div className="w-14 h-14 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] transition-transform duration-300 group-hover:scale-105">
                        <Icon className="w-7 h-7" />
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

            <div className="pt-4 flex gap-3">
              <Button 
                variant="outline"
                onClick={() => changeStep(1)} 
                disabled={loading}
                className="min-h-[56px] w-[60px] p-0 flex-shrink-0 rounded-xl border-2 hover:bg-[var(--color-surface-container-low)]"
              >
                <ArrowLeft className="w-5 h-5 text-[var(--color-on-surface-variant)]" />
              </Button>
              <Button 
                onClick={handleComplete} 
                disabled={!primaryGoal || loading}
                className="flex-1 min-h-[56px] text-[16px] font-semibold rounded-xl"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Complete Setup'}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3 - SUCCESS */}
        {step === 3 && (
          <div className="flex flex-col items-center justify-center py-6 max-w-3xl mx-auto">
            <div className="w-full space-y-10">
              
              {/* Celebration header */}
              <div className="flex flex-col items-center space-y-3 text-center pt-2">
                <div className="relative w-full flex justify-center h-0 pointer-events-none z-0">
                  <Lottie 
                    animationData={confettiAnimation} 
                    loop={false} 
                    autoplay={true} 
                    className="absolute -top-32 w-64 h-64 opacity-90 scale-125"
                  />
                </div>
                
                <div className="space-y-3 relative z-10">
                  <h2 className="text-[28px] font-extrabold text-[var(--color-on-surface)] leading-tight tracking-tight">You're Ready to Start Planning</h2>
                  <p className="text-[16px] text-[var(--color-on-surface-variant)] opacity-80 leading-relaxed max-w-lg mx-auto">
                    PlateUp is ready to generate personalized meal plans tailored to your household.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
                {/* Left Column: Configuration Summary */}
                <div className="p-6 rounded-2xl bg-[var(--color-surface-container-highest)] border border-[var(--color-outline-variant)]">
                  <h3 className="text-[13px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-5">Profile Summary</h3>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <span className="text-[14px] font-medium text-[var(--color-on-surface-variant)] flex items-center gap-2">
                        <Users className="w-4 h-4" /> Household Size
                      </span>
                      <div className="inline-flex items-center px-3 py-1.5 bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-lg text-[14px] font-semibold text-[var(--color-on-surface)]">
                        {householdSizes.find(s => s.value === householdSize)?.label}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <span className="text-[14px] font-medium text-[var(--color-on-surface-variant)] flex items-center gap-2">
                        <HeartPulse className="w-4 h-4" /> Primary Goal
                      </span>
                      <div className="inline-flex items-center px-3 py-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg text-[14px] font-semibold">
                        {primaryGoals.find(g => g.value === primaryGoal)?.label}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: What You'll Get */}
                <div className="p-6 rounded-2xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <h3 className="text-[16px] font-bold text-[var(--color-on-surface)] mb-5">What You'll Get</h3>
                  <div className="space-y-3.5">
                    {[
                      '7-Day Nigerian Meal Plans',
                      'Smart Shopping Lists',
                      'Budget-Aware Recommendations',
                      'Ingredient Optimization',
                      'Save & Reuse Meal Plans',
                      'WhatsApp Sharing'
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-[var(--color-primary)]" strokeWidth={3} />
                        </div>
                        <span className="text-[14.5px] font-medium text-[var(--color-on-surface)]">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 w-full max-w-md mx-auto flex flex-col items-center">
                <Button 
                  onClick={handleGenerateMealPlan}
                  disabled={loading}
                  className="w-full min-h-[60px] text-[18px] font-semibold rounded-xl bg-[var(--color-primary)] text-white shadow-[0_4px_14px_0_rgba(17,94,59,0.39)] hover:shadow-[0_6px_20px_rgba(17,94,59,0.23)] hover:-translate-y-0.5 transition-all"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Start Planning My Week <ArrowRight className="w-5 h-5 ml-2.5" /></>}
                </Button>
                <p className="mt-4 text-[13px] text-[var(--color-on-surface-variant)] opacity-70 text-center px-4">
                  Your meal plan will be generated based on your household size and goals.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

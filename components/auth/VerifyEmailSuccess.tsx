'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';
import Lottie from 'lottie-react';

import confettiAnimation from '@/public/confetti.json';

interface VerifyEmailSuccessProps {
  email?: string;
}

export function VerifyEmailSuccess({ email }: VerifyEmailSuccessProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleContinue = () => {
    setLoading(true);
    // User is already onboarded — go straight to the dashboard
    router.push('/dashboard');
  };

  return (
    <div className="w-full text-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-80 scale-150">
        <Lottie 
          animationData={confettiAnimation} 
          loop={true} 
          autoplay={true} 
          className="w-full h-full"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] pr-3 pl-1.5 py-1.5 rounded-full text-xs font-bold tracking-widest mb-6">
          <div className="w-4 h-4 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </div>
          VERIFIED
        </div>
        
        <h1 className="text-2xl sm:text-[32px] font-bold text-[var(--color-on-surface)] mb-4 leading-tight tracking-tight">
          🎉 Your account is fully secured.
        </h1>
        
        <p className="text-[var(--color-on-surface-variant)] text-[16px] leading-relaxed mb-10 max-w-[340px] mx-auto">
          {email
            ? `${email} has been verified. You're all set — your PlateUp account is now fully secured.`
            : "Your email has been verified. You're all set to keep planning smarter Nigerian meals."}
        </p>

        <div className="w-full flex items-center justify-between relative mb-12 px-2">
          {/* Connecting Line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-[var(--color-outline-variant)] -z-10" />
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-[var(--color-primary)] -z-10" />

          {/* Step 1 */}
          <div className="flex flex-col items-center gap-2 bg-white px-2">
            <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-sm">
              <Check className="w-4 h-4" strokeWidth={3} />
            </div>
            <span className="text-[12px] font-semibold text-[var(--color-on-surface)] text-center max-w-[80px] leading-tight">Account Created</span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center gap-2 bg-white px-2">
            <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-sm">
              <Check className="w-4 h-4" strokeWidth={3} />
            </div>
            <span className="text-[12px] font-semibold text-[var(--color-on-surface)] text-center max-w-[80px] leading-tight">Onboarded</span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center gap-2 bg-white px-2">
            <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-sm">
              <Check className="w-4 h-4" strokeWidth={3} />
            </div>
            <span className="text-[12px] font-semibold text-[var(--color-on-surface)] text-center max-w-[80px] leading-tight">Email Verified</span>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center gap-2 bg-white px-2">
            <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-sm">
              <Check className="w-4 h-4" strokeWidth={3} />
            </div>
            <span className="text-[12px] font-semibold text-[var(--color-on-surface)] text-center max-w-[80px] leading-tight">Ready to Plan</span>
          </div>
        </div>

        <button
          id="verification-success-continue-btn"
          onClick={handleContinue}
          disabled={loading}
          className="inline-flex items-center justify-center w-full min-h-[52px] rounded-xl bg-[var(--color-primary)] text-white font-semibold text-[16px] hover:opacity-90 transition-all shadow-[0_4px_14px_0_rgba(17,94,59,0.39)] hover:shadow-[0_6px_20px_rgba(17,94,59,0.23)] hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:-translate-y-0 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>Go to Dashboard &rarr;</>
          )}
        </button>
      </div>
    </div>
  );
}

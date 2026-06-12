'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default function AuthRightPanel() {
  const pathname = usePathname();
  const isLogin = pathname === '/auth/login';
  const isVerify = pathname === '/auth/verify-email';
  const isForgotPassword = pathname === '/auth/forgot-password';
  const isResetPassword = pathname === '/auth/reset-password';

  const searchParams = useSearchParams();
  const isSuccessState = searchParams.get('success') === 'true';

  let imageSrc = "/auth-illustration-v3.png";
  if (isVerify) imageSrc = "/auth-success-illustration.png";
  else if (isForgotPassword && isSuccessState) imageSrc = "/check-email-illustration.png";
  else if (isForgotPassword) imageSrc = "/forgot-password-illustration.png";
  else if (isResetPassword && isSuccessState) imageSrc = "/password-success-illustration.png";
  else if (isResetPassword) imageSrc = "/reset-password-illustration.png";
  else if (isLogin) imageSrc = "/auth-login-illustration-v5.png";

  return (
    <div className="hidden lg:flex flex-1 flex-col justify-center items-center bg-white p-12 lg:w-[55%] relative overflow-hidden">
      <div className="relative z-10 max-w-xl w-full flex flex-col items-center">
        
        <div className={`w-full max-w-[24rem] aspect-square relative flex items-center justify-center transition-all duration-700 ${isVerify ? 'scale-90 opacity-90 mb-3' : 'mb-[40px]'}`}>
          {/* Organic Background Shapes */}
          <div className="absolute inset-2 bg-[var(--color-primary)] opacity-[0.02] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] transition-transform duration-1000 ease-in-out hover:scale-105" />
          <div className="absolute inset-6 bg-[var(--color-primary)] opacity-[0.01] rounded-[60%_40%_30%_70%/50%_40%_60%_50%] rotate-45 transition-transform duration-1000 ease-in-out hover:-rotate-12" />
          <div className="absolute inset-10 bg-[var(--color-primary)] opacity-[0.01] rounded-full blur-2xl" />

          {/* Illustration */}
          <div className="absolute inset-0 z-10 animate-float">
            {pathname && (
              <Image 
                src={imageSrc} 
                alt="PlateUp Meal Planning" 
                fill
                className="object-contain mix-blend-multiply scale-[0.92] contrast-[1.1] brightness-[1.05]"
                priority
              />
            )}
          </div>
        </div>

        <div className="w-full flex justify-center">
          <div className="max-w-md w-full">
            <h2 
              className="text-[#115e3b] mb-4 text-left leading-tight"
              style={{
                fontSize: 'var(--typography-headline-large-font-size)',
                fontWeight: 'var(--typography-headline-large-font-weight)',
                letterSpacing: 'var(--typography-headline-large-letter-spacing)'
              }}
            >
              {isVerify 
                ? "You're one step away from smarter meal planning." 
                : (isForgotPassword || isResetPassword)
                  ? "Secure Password Recovery."
                : isLogin 
                  ? "Welcome back to smarter meal Planning." 
                  : "Plan better Nigerian meals faster."}
            </h2>

            {isVerify && (
              <p className="text-base text-[var(--color-on-surface-variant)] leading-relaxed mb-8">
                Your account is ready. Next, we'll learn a little about your household so PlateUp can generate meal plans tailored to your needs and budget.
              </p>
            )}
            
            {(isForgotPassword || isResetPassword) && (
              <p className="text-base text-[var(--color-on-surface-variant)] leading-relaxed mb-8">
                Reset your password safely and regain access to your PlateUp account.
              </p>
            )}
            
            {isVerify ? (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 text-[var(--color-primary)] flex-shrink-0" />
                  <p className="text-base text-[var(--color-on-surface-variant)] leading-relaxed">Personalized meal recommendations</p>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 text-[var(--color-primary)] flex-shrink-0" />
                  <p className="text-base text-[var(--color-on-surface-variant)] leading-relaxed">Budget-aware Nigerian meal plans</p>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 text-[var(--color-primary)] flex-shrink-0" />
                  <p className="text-base text-[var(--color-on-surface-variant)] leading-relaxed">Smart shopping lists</p>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 text-[var(--color-primary)] flex-shrink-0" />
                  <p className="text-base text-[var(--color-on-surface-variant)] leading-relaxed">Save and reuse meal plans anytime</p>
                </div>
              </div>
            ) : (isForgotPassword || isResetPassword) ? (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 text-[var(--color-primary)] flex-shrink-0" />
                  <p className="text-base text-[var(--color-on-surface-variant)] leading-relaxed">Secure reset link sent to your email.</p>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 text-[var(--color-primary)] flex-shrink-0" />
                  <p className="text-base text-[var(--color-on-surface-variant)] leading-relaxed">Password reset links expire automatically.</p>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 text-[var(--color-primary)] flex-shrink-0" />
                  <p className="text-base text-[var(--color-on-surface-variant)] leading-relaxed">One-time use tokens for added security.</p>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 text-[var(--color-primary)] flex-shrink-0" />
                  <p className="text-base text-[var(--color-on-surface-variant)] leading-relaxed">Create a new password in minutes.</p>
                </div>
              </div>
            ) : isLogin ? (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 text-[var(--color-primary)] flex-shrink-0" />
                  <p className="text-base text-[var(--color-on-surface-variant)] leading-relaxed">Access your saved Nigerian meal plans.</p>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 text-[var(--color-primary)] flex-shrink-0" />
                  <p className="text-base text-[var(--color-on-surface-variant)] leading-relaxed">View and reuse past weekly menus.</p>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 text-[var(--color-primary)] flex-shrink-0" />
                  <p className="text-base text-[var(--color-on-surface-variant)] leading-relaxed">Track your budget and dietary goals effortlessly.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 text-[var(--color-primary)] flex-shrink-0" />
                  <p className="text-base text-[var(--color-on-surface-variant)] leading-relaxed">Generate a 7-day budget-aware Nigerian meal plan.</p>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 text-[var(--color-primary)] flex-shrink-0" />
                  <p className="text-base text-[var(--color-on-surface-variant)] leading-relaxed">Instantly create tailored shopping lists.</p>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 text-[var(--color-primary)] flex-shrink-0" />
                  <p className="text-base text-[var(--color-on-surface-variant)] leading-relaxed">Save money, reduce food waste, and export to WhatsApp.</p>
                </div>
              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
}

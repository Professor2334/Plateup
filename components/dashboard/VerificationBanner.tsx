/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { AlertTriangle, X, Mail, Loader2, CheckCircle, Shield } from 'lucide-react';
import { resendVerificationEmailAction } from '@/app/actions/auth/actions';
import { Feedback } from '@/lib/feedback';

interface VerificationBannerProps {
  email: string;
  onDismiss?: () => void;
}

export function VerificationBanner({ email, onDismiss }: VerificationBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendState, setResendState] = useState<'idle' | 'success' | 'error'>('idle');

  if (dismissed) return null;

  const handleResend = async () => {
    setIsResending(true);
    setResendState('idle');
    try {
      const res = await resendVerificationEmailAction(email);
      if (res.success) {
        setResendState('success');
        Feedback.success.verificationSent();
      } else {
        setResendState('error');
        Feedback.error.verification();
      }
    } catch {
      setResendState('error');
      Feedback.error.verification();
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      role="alert"
      className="flex flex-col sm:flex-row items-center sm:items-center justify-between p-5 md:px-5 md:py-4 gap-4 sm:gap-4 text-center sm:text-left rounded-2xl bg-[color-mix(in_srgb,var(--color-accent)_8%,var(--color-surface))] shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-shadow duration-300 relative"
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 w-full sm:w-auto">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[color-mix(in_srgb,var(--color-accent)_15%,transparent)] text-[var(--color-accent)] flex-shrink-0">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-[0.875rem] font-semibold text-[var(--color-on-surface)]">Verify your email address</h3>
          <p className="text-[0.8125rem] text-[var(--color-on-surface-variant)] opacity-80 mt-0.5">
            Please verify your email to unlock all features and secure your account.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto flex-shrink-0 mt-2 sm:mt-0">
        <button
          id="verification-banner-resend-btn"
          onClick={handleResend}
          disabled={isResending || resendState === 'success'}
          className="w-full sm:w-auto flex justify-center items-center gap-2 px-4 py-3 sm:py-2 bg-[var(--color-surface)] shadow-sm rounded-xl sm:rounded-lg text-[0.875rem] sm:text-[0.8125rem] font-semibold text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-lowest)] disabled:opacity-50 transition-colors"
        >
          {isResending ? (
            <Loader2 className="w-4 h-4 animate-spin text-[var(--color-on-surface-variant)]" />
          ) : (
            <Mail className="w-4 h-4 text-[var(--color-on-surface-variant)]" />
          )}
          Verify Email
        </button>

        <div className="w-[1px] h-6 bg-[color-mix(in_srgb,var(--color-on-surface)_15%,transparent)] hidden sm:block mx-1"></div>

        <button
          id="verification-banner-dismiss-btn"
          onClick={() => {
            setDismissed(true);
            onDismiss?.();
          }}
          className="absolute top-3 right-3 sm:relative sm:top-0 sm:right-0 p-1.5 rounded-full hover:bg-[color-mix(in_srgb,var(--color-on-surface)_8%,transparent)] text-[var(--color-on-surface-variant)] transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-5 h-5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
}

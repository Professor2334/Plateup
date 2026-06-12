'use client';

import { useState } from 'react';
import { AlertTriangle, X, Mail, Loader2, CheckCircle, Shield } from 'lucide-react';
import { resendVerificationEmailAction } from '@/app/actions/auth/actions';

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
      setResendState(res.success ? 'success' : 'error');
    } catch {
      setResendState('error');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      role="alert"
      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:px-5 md:py-4 gap-4 rounded-2xl bg-[color-mix(in_srgb,var(--color-accent)_8%,var(--color-surface))] shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-shadow duration-300"
    >
      <div className="flex items-start sm:items-center gap-4">
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

      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
        {resendState === 'success' ? (
          <span className="flex items-center gap-1.5 text-[0.8125rem] font-semibold text-[var(--color-primary)]">
            <CheckCircle className="w-4 h-4" />
            Email Sent
          </span>
        ) : resendState === 'error' ? (
          <span className="text-[0.8125rem] font-semibold text-[var(--color-error)]">Failed. Try again.</span>
        ) : null}

        <button
          id="verification-banner-resend-btn"
          onClick={handleResend}
          disabled={isResending || resendState === 'success'}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] shadow-sm rounded-lg text-[0.8125rem] font-semibold text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-lowest)] disabled:opacity-50 transition-colors"
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
          className="p-1.5 rounded-md hover:bg-[color-mix(in_srgb,var(--color-on-surface)_8%,transparent)] text-[var(--color-on-surface-variant)] transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

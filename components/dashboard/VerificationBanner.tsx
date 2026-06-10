'use client';

import { useState } from 'react';
import { AlertTriangle, X, Mail, Loader2, CheckCircle } from 'lucide-react';
import { resendVerificationEmailAction } from '@/app/actions/auth/actions';

interface VerificationBannerProps {
  email: string;
}

export function VerificationBanner({ email }: VerificationBannerProps) {
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
      className="flex items-start sm:items-center justify-between gap-3 px-4 py-3 rounded-xl border border-[var(--color-outline-variant)] bg-[color-mix(in_srgb,var(--color-accent)_8%,var(--color-surface))] text-sm"
    >
      <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
        <AlertTriangle
          className="w-4 h-4 text-[var(--color-accent)] flex-shrink-0 mt-0.5 sm:mt-0"
          aria-hidden
        />
        <span className="text-[var(--color-on-surface)] font-medium leading-snug">
          Verify your email to secure your account.
        </span>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        {resendState === 'success' ? (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)]">
            <CheckCircle className="w-3.5 h-3.5" />
            Sent!
          </span>
        ) : resendState === 'error' ? (
          <span className="text-xs font-semibold text-[var(--color-error)]">Failed. Try again.</span>
        ) : null}

        <button
          id="verification-banner-resend-btn"
          onClick={handleResend}
          disabled={isResending || resendState === 'success'}
          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] hover:underline disabled:opacity-50 disabled:no-underline transition-opacity"
        >
          {isResending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Mail className="w-3.5 h-3.5" />
          )}
          Resend Email
        </button>

        <button
          id="verification-banner-dismiss-btn"
          onClick={() => setDismissed(true)}
          className="p-1 rounded-md hover:bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

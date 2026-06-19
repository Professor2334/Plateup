'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { requestPasswordReset } from '@/app/actions/auth/reset-actions';
import { Feedback } from '@/lib/feedback';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await requestPasswordReset(formData);
    
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      Feedback.success.resetSent();
      router.replace('/auth/forgot-password?success=true');
    } else {
      Feedback.error.reset();
    }
  };

  if (success) {
    return (
      <>
        {/* Mobile Back Button - Top Left */}
        <div className="absolute top-10 left-6 sm:hidden z-50">
          <Link
            href="/auth/login"
            className="p-2 rounded-full bg-[var(--color-surface-container-lowest)] shadow-sm border border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)] transition-all focus:outline-none flex items-center justify-center"
            aria-label="Back to Login"
          >
            <ArrowLeft size={20} />
          </Link>
        </div>

        <div className="w-full space-y-8 animate-in fade-in duration-500">
        <div className="text-left mb-10">
          <div className="w-12 h-12 bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] text-[var(--color-primary)] rounded-2xl flex items-center justify-center mb-6">
            <MailCheck className="w-6 h-6" />
          </div>
          <h2 className="text-on-surface-variant text-headline-large font-bold">
            Check Your Email
          </h2>
          <p className="mt-3 text-body-large font-normal text-on-surface-variant opacity-80 leading-relaxed">
            If an account exists for that email address, we've sent a password reset link. Please check your inbox and follow the instructions.
          </p>
        </div>

        <Link href="/auth/login" className="hidden sm:block w-full">
          <Button type="button" variant="outline" className="w-full min-h-[48px] rounded-xl font-bold border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4 translate-y-[1px]" />
            <span>Back to Login</span>
          </Button>
        </Link>
      </div>
    </>
  );
  }

  return (
    <>
      {/* Mobile Back Button - Top Left */}
      <div className="absolute top-10 left-6 sm:hidden z-50">
        <Link
          href="/auth/login"
          className="p-2 rounded-full bg-[var(--color-surface-container-lowest)] shadow-sm border border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)] transition-all focus:outline-none flex items-center justify-center"
          aria-label="Back to Login"
        >
          <ArrowLeft size={20} />
        </Link>
      </div>

      <div className="w-full space-y-8 animate-in fade-in duration-300">
        <div className="text-left mb-10">
          <h2 className="text-on-surface-variant text-headline-large font-bold">
            Forgot Your Password?
          </h2>
          <p className="mt-3 text-body-large font-normal text-on-surface-variant opacity-80 leading-relaxed">
            Enter your email address and we'll send you a secure password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="space-y-2">
            <label htmlFor="email" className="text-[14px] font-semibold text-[var(--color-on-surface)] block">
              Email Address
            </label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="Enter your email address"  
              required 
              autoFocus
              className="w-full text-[15px] font-medium text-[var(--color-on-surface)] bg-[#f9fafb] border border-[var(--color-outline-variant)]/30 rounded-xl px-4 py-3.5 focus:outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all"
            />
          </div>
          

          
          <div className="pt-2 flex flex-col gap-3">
            <Button 
              type="submit" 
              className="w-full min-h-[48px] rounded-xl font-bold shadow-sm"
              style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {Feedback.loading.reset}
                </span>
              ) : (
                'Send Reset Link'
              )}
            </Button>
            <Link href="/auth/login" className="hidden sm:block w-full">
              <Button type="button" variant="outline" className="w-full min-h-[48px] rounded-xl font-semibold text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] border-transparent shadow-none bg-transparent hover:bg-[var(--color-surface-container-low)] flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4 translate-y-[1px]" />
                <span>Back to Login</span>
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

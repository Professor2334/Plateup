'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { resetPassword } from '@/app/actions/auth/reset-actions';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="w-full flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing password reset token.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    // append token to formData manually since it's from URL
    formData.append('token', token);

    const res = await resetPassword(formData);
    
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      router.replace('/auth/reset-password?success=true');
    } else {
      setError(res.error || 'Failed to reset password');
    }
  };

  if (success) {
    return (
      <div className="w-full space-y-8 animate-in fade-in duration-500">
        <div className="text-left mb-10">
          <div className="w-12 h-12 bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] text-[var(--color-primary)] rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-on-surface-variant text-headline-large font-bold">
            Password Updated Successfully
          </h2>
          <p className="mt-3 text-body-large font-normal text-on-surface-variant opacity-80 leading-relaxed">
            Your password has been updated. You can now sign in using your new password.
          </p>
        </div>

        <Link href="/auth/login" className="block w-full">
          <Button type="button" className="w-full min-h-[48px] rounded-xl font-bold shadow-sm" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>
            Continue to Login
            <ArrowRight className="w-4 h-4 ml-2 inline-block" />
          </Button>
        </Link>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="w-full space-y-8 animate-in fade-in duration-300">
        <div className="text-left mb-10">
          <h2 className="text-on-surface-variant text-headline-large font-bold text-[var(--color-error)]">
            Invalid Link
          </h2>
          <p className="mt-3 text-body-large font-normal text-on-surface-variant opacity-80 leading-relaxed">
            {error}
          </p>
        </div>
        <Link href="/auth/forgot-password" className="block w-full">
          <Button type="button" variant="outline" className="w-full min-h-[48px] rounded-xl font-bold">
            Request New Link
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      <div className="text-left mb-10">
        <h2 className="text-on-surface-variant text-headline-large font-bold">
          Create New Password
        </h2>
        <p className="mt-3 text-body-large font-normal text-on-surface-variant opacity-80 leading-relaxed">
          Enter a new password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="password" className="text-[14px] font-semibold text-[var(--color-on-surface)] block">
            New Password
          </label>
          <div className="relative">
            <Input 
              id="password" 
              name="password" 
              type={showPassword ? 'text' : 'password'} 
              required 
              autoFocus
              placeholder="Enter new password"
              className="w-full text-[15px] font-medium text-[var(--color-on-surface)] bg-[#f9fafb] border border-[var(--color-outline-variant)]/30 rounded-xl px-4 py-3.5 focus:outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all pr-14"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[var(--color-primary)] hover:opacity-80 transition-opacity"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-[14px] font-semibold text-[var(--color-on-surface)] block">
            Confirm New Password
          </label>
          <Input 
            id="confirmPassword" 
            name="confirmPassword" 
            type={showPassword ? 'text' : 'password'} 
            required 
            placeholder="Confirm new password"
            className="w-full text-[15px] font-medium text-[var(--color-on-surface)] bg-[#f9fafb] border border-[var(--color-outline-variant)]/30 rounded-xl px-4 py-3.5 focus:outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all"
          />
        </div>
        
        {error && <p className="text-[var(--color-error)] text-sm font-medium">{error}</p>}
        
        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full min-h-[48px] rounded-xl font-bold shadow-sm"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Update Password'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

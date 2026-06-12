'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export function LoginForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailDone, setEmailDone] = useState(false);
  const [passwordDone, setPasswordDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledEmail = searchParams.get('email') || '';

  useEffect(() => {
    if (prefilledEmail) {
      setEmailDone(true);
    }
  }, [prefilledEmail]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      // In Auth.js v5 using next-auth/react, we can sign in via Client Component
      // or we can use a Server Action. Client-side signIn is standard.
      const { signIn } = await import('next-auth/react');
      
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          defaultValue={prefilledEmail}
          placeholder="Enter your email address"  
          required 
          autoFocus
          onBlur={(e) => setEmailDone(!!e.target.value.trim())}
          className={`placeholder:opacity-70 ${emailDone ? '!bg-[var(--color-inverse-on-surface)]' : ''}`}
        />
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <Link href="/auth/forgot-password" className="text-[13px] font-semibold text-[var(--color-primary)] hover:underline">
            Forgot Password?
          </Link>
        </div>
        <div className="relative">
          <Input 
            id="password" 
            name="password" 
            type={showPassword ? 'text' : 'password'} 
            required 
            placeholder="Enter Password"
            onBlur={(e) => setPasswordDone(!!e.target.value)}
            className={`pr-14 placeholder:opacity-70 ${passwordDone ? '!bg-[var(--color-inverse-on-surface)]' : ''}`}
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)} 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] font-medium text-[var(--color-primary)] hover:opacity-80 transition-opacity"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
      {error && <p className="text-[var(--color-error)] text-sm">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          'Sign In'
        )}
      </Button>
    </form>
  );
}

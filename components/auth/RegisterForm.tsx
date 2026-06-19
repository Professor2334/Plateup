'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { registerUser } from '@/app/actions/auth/actions';
import { Feedback } from '@/lib/feedback';

export function RegisterForm() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [nameError, setNameError] = useState('');
  const [nameTouched, setNameTouched] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordRequirement, setPasswordRequirement] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleContinue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let hasError = false;
    if (!name.trim()) {
      setNameError('Full name is required.');
      hasError = true;
    } else if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters.');
      hasError = true;
    }
    if (!email.trim()) {
      setEmailError('Email address is required.');
      hasError = true;
    }
    if (hasError) return;

    setError('');
    setStep(2);
  };

  const validatePassword = (pass: string) => {
    if (!/[A-Z]/.test(pass)) return 'Must contain one uppercase letter';
    if (!/[a-z]/.test(pass)) return 'Must contain one lowercase letter';
    if (!/[0-9]/.test(pass)) return 'Must contain one number';
    if (!/[^A-Za-z0-9]/.test(pass)) return 'Must contain one special character';
    if (pass.length < 8) return 'Must be at least 8 characters';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let hasError = false;
    if (!password) {
      setPasswordError('Password is required.');
      hasError = true;
    } else {
      const passErr = validatePassword(password);
      if (passErr) {
        setPasswordError(passErr);
        hasError = true;
      }
    }
    if (!confirmPassword) {
      setConfirmPasswordError('Password confirmation is required.');
      hasError = true;
    }
    if (hasError) return;
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);

    try {
      const res = await registerUser(formData);

      if (!res?.success) {
        setError(res?.error || 'Registration failed');
        return;
      }

      // Auto sign-in immediately — user goes straight to onboarding
      const { signIn } = await import('next-auth/react');
      const signInRes = await signIn('credentials', {
        email: res.email,
        password: res.password,
        redirect: false,
      });

      if (signInRes?.error) {
        // Edge case: account created but sign-in failed — send to login
        router.push(`/auth/login?email=${encodeURIComponent(email)}`);
      } else {
        router.push('/dashboard/onboarding');
        router.refresh();
      }
    } catch {
      Feedback.error.unexpected();
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <form onSubmit={handleContinue} className="space-y-4" noValidate>
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium">Full Name</label>
          <Input 
            id="name" 
            value={name}
            onChange={(e) => {
              const val = e.target.value;
              setName(val);
              if (val.length > 0 && val.trim().length < 2) {
                setNameError('Name must be at least 2 characters.');
              } else if (nameError) {
                setNameError('');
              }
            }}
            onBlur={(e) => {
              setNameTouched(true);
              if (e.relatedTarget && e.relatedTarget.tagName === 'INPUT') {
                if (!name.trim()) {
                  setNameError('This field cannot be empty');
                }
              }
            }}
            type="text" 
            placeholder="Enter your full name" 
            required 
            autoFocus
            className={`placeholder:opacity-70 ${nameError ? '!border-[var(--color-error)] focus-visible:!border-[var(--color-error)]' : ''} ${(nameTouched && !nameError && name.trim().length >= 2) ? '!bg-[var(--color-inverse-on-surface)]' : ''}`}
          />
          {nameError && <p className="mt-[var(--space-2)] p-2 px-3 rounded-md bg-[color-mix(in_srgb,var(--color-error-container)_35%,transparent)] text-xs font-normal text-[var(--color-on-error-container)]">{nameError}</p>}
        </div>
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <Input 
            id="email" 
            value={email}
            onChange={(e) => {
              const val = e.target.value;
              setEmail(val);
              if (val.length > 0 && !val.includes('@')) {
                setEmailError('Enter a valid email address');
              } else if (emailError) {
                setEmailError('');
              }
            }}
            onBlur={(e) => {
              setEmailTouched(true);
              if (e.relatedTarget && e.relatedTarget.tagName === 'INPUT') {
                if (!email.trim()) {
                  setEmailError('This field cannot be empty');
                }
              }
            }}
            type="email" 
            placeholder="Enter your email address" 
            required 
            className={`placeholder:opacity-70 ${emailError ? '!border-[var(--color-error)] focus-visible:!border-[var(--color-error)]' : ''} ${(emailTouched && !emailError && email.trim().length > 0) ? '!bg-[var(--color-inverse-on-surface)]' : ''}`}
          />
          {emailError && <p className="mt-[var(--space-2)] p-2 px-3 rounded-md bg-[color-mix(in_srgb,var(--color-error-container)_35%,transparent)] text-xs font-normal text-[var(--color-on-error-container)]">{emailError}</p>}
        </div>
        <div className="pt-2 md:pt-0">
          <Button type="submit" className="w-full cursor-pointer group flex items-center justify-center gap-2">
            <span>Continue</span>
            <ArrowRight size={20} className="hidden md:block transition-transform group-hover:translate-x-1 mt-0.5" />
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Mobile Back Button */}
      <button
        type="button"
        onClick={() => setStep(1)}
        disabled={loading}
        className="lg:hidden absolute top-12 left-8 md:top-10 md:left-6 p-2 rounded-full bg-[var(--color-surface-container-lowest)] shadow-sm border border-[var(--color-outline-variant)]/30 text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)] transition-all focus:outline-none z-50"
        aria-label="Go back"
      >
        <ArrowLeft size={20} />
      </button>
      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium">Password</label>
        <div className="relative">
          <Input 
            id="password" 
            value={password}
            onChange={(e) => {
              const val = e.target.value;
              setPassword(val);
              if (passwordError) setPasswordError('');
              if (val.length > 0) {
                setPasswordRequirement(validatePassword(val));
              } else {
                setPasswordRequirement('');
              }
            }}
            onBlur={(e) => {
              setPasswordTouched(true);
              if (e.relatedTarget && e.relatedTarget.tagName === 'INPUT') {
                if (!password) {
                  setPasswordError('This field cannot be empty');
                }
              }
            }}
            type={showPassword ? 'text' : 'password'} 
            placeholder="Choose Password"
            required 
            minLength={8} 
            className={`pr-14 placeholder:opacity-70 ${passwordError ? '!border-[var(--color-error)] focus-visible:!border-[var(--color-error)]' : ''} ${(passwordTouched && !passwordError && password.length > 0) ? '!bg-[var(--color-inverse-on-surface)]' : ''}`}
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)} 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[0.8125rem] font-medium text-[var(--color-primary)] hover:opacity-80 transition-opacity"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {passwordError && <p className="mt-[var(--space-2)] p-2 px-3 rounded-md bg-[color-mix(in_srgb,var(--color-error-container)_35%,transparent)] text-xs font-normal text-[var(--color-on-error-container)]">{passwordError}</p>}
        {passwordRequirement && !passwordError && (
          <p className="mt-1 text-xs text-[var(--color-on-surface-variant)] flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-[var(--color-outline-variant)]"></span>
            {passwordRequirement}
          </p>
        )}
      </div>
      <div className="space-y-1">
        <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
        <div className="relative">
          <Input 
            id="confirmPassword" 
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (confirmPasswordError) setConfirmPasswordError('');
            }}
            onBlur={(e) => {
              setConfirmPasswordTouched(true);
              if (e.relatedTarget && e.relatedTarget.tagName === 'INPUT') {
                if (!confirmPassword) {
                  setConfirmPasswordError('This field cannot be empty');
                }
              }
            }}
            type={showConfirmPassword ? 'text' : 'password'} 
            placeholder="Confirm Password"
            required 
            minLength={8} 
            className={`pr-14 placeholder:opacity-70 ${confirmPasswordError ? '!border-[var(--color-error)] focus-visible:!border-[var(--color-error)]' : ''} ${(confirmPasswordTouched && !confirmPasswordError && confirmPassword.length > 0) ? '!bg-[var(--color-inverse-on-surface)]' : ''}`}
          />
          <button 
            type="button" 
            onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[0.8125rem] font-medium text-[var(--color-primary)] hover:opacity-80 transition-opacity"
          >
            {showConfirmPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {confirmPasswordError && <p className="mt-1 text-xs font-medium text-[var(--color-error)]">{confirmPasswordError}</p>}
      </div>

      {error && <p className="text-[var(--color-error)] text-sm">{error}</p>}
      <div className="space-y-4 pt-4 md:pt-2">
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              {Feedback.loading.signup}
            </span>
          ) : (
            'Create Account'
          )}
        </Button>
        <p className="text-center text-[0.8125rem] text-[var(--color-on-surface-variant)] px-2">
          By creating an account, you agree to our <Link href="/terms" className="font-bold text-[var(--color-primary)] hover:underline">Terms of Service</Link> and <Link href="/privacy" className="font-bold text-[var(--color-primary)] hover:underline">Privacy Policy</Link>.
        </p>
        <div className="text-center hidden lg:block">
          <button 
            type="button" 
            onClick={() => setStep(1)} 
            disabled={loading} 
            className="text-sm font-medium text-on-surface-variant hover:text-primary hover:underline focus:outline-none disabled:opacity-50 transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>
    </form>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { registerUser } from '@/app/actions/auth/actions';

export function RegisterForm() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleContinue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
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
      } else {
        setSuccess(true);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <h3 className="text-lg font-medium text-[var(--color-primary)]">Check your email</h3>
        <p className="text-sm text-[var(--color-on-surface-variant)]">
          {"We've sent a verification link to your email address. Please verify your email before signing in."}
        </p>
        <Button onClick={() => router.push('/auth/login')} variant="outline" className="w-full">
          Back to Login
        </Button>
      </div>
    );
  }

  if (step === 1) {
    return (
      <form onSubmit={handleContinue} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium">Full Name</label>
          <Input 
            id="name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text" 
            placeholder="Enter your full name" 
            required 
            autoFocus
            className="placeholder:opacity-70"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <Input 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email" 
            placeholder="Enter your email address" 
            required 
            className="placeholder:opacity-70"
          />
        </div>
        <div className="pt-2">
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium">Choose Password</label>
        <Input 
          id="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password" 
          required 
          minLength={8} 
          className="placeholder:opacity-70"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
        <Input 
          id="confirmPassword" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password" 
          required 
          minLength={8} 
          className="placeholder:opacity-70"
        />
      </div>
      {error && <p className="text-[var(--color-error)] text-sm">{error}</p>}
      <div className="space-y-4 pt-2">
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
        <div className="text-center">
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

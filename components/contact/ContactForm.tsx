'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { submitContactMessage } from '@/app/actions/contact/actions';
import { Loader2, Send, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export function ContactForm({ defaultEmail }: { defaultEmail: string | null }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const res = await submitContactMessage(formData);

    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error || 'Something went wrong.');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="bg-[var(--color-surface)] p-8 md:p-12 rounded-[32px] shadow-sm border border-[var(--color-outline-variant)]/30 text-center">
        <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-[var(--color-primary)]" strokeWidth={2.5} />
        </div>
        <h2 className="text-[1.5rem] font-extrabold text-[var(--color-on-surface)] mb-3">Message Sent Successfully</h2>
        <p className="text-[0.9375rem] font-medium text-[var(--color-on-surface-variant)] leading-relaxed mb-8">
          We've received your message and will get back to you within 1–2 business days.
        </p>
        <Link href="/" className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-[var(--color-primary)] text-white text-[0.875rem] font-bold hover:opacity-90 transition-opacity shadow-sm">
          Return to PlateUp
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {defaultEmail ? (
        <div className="space-y-2">
          <label className="text-[0.8125rem] font-bold text-[var(--color-on-surface)]">Your email address</label>
          <div className="text-[0.9375rem] font-medium text-[var(--color-on-surface-variant)] py-2">
            {defaultEmail}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <label htmlFor="email" className="text-[0.8125rem] font-bold text-[var(--color-on-surface)]">Email Address</label>
          <Input 
            id="email"
            name="email"
            type="email" 
            placeholder="you@example.com" 
            required 
            className="h-12 bg-white border-[var(--color-outline-variant)]/50 focus-visible:ring-[var(--color-primary)] rounded-xl"
          />
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="subject" className="text-[0.8125rem] font-bold text-[var(--color-on-surface)]">Subject</label>
        <Input 
          id="subject"
          name="subject"
          type="text" 
          placeholder="Title your message" 
          required 
          className="h-12 bg-white border-[var(--color-outline-variant)]/50 focus-visible:ring-[var(--color-primary)] rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-[0.8125rem] font-bold text-[var(--color-on-surface)]">Message</label>
        <textarea 
          id="message"
          name="message"
          placeholder="What do you need help with?" 
          required 
          rows={6}
          className="w-full rounded-xl border border-[var(--color-outline-variant)]/50 bg-white px-4 py-3 text-[0.875rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] resize-y placeholder:opacity-60 placeholder:font-normal"
        />
      </div>

      {error && <p className="text-sm font-medium text-[var(--color-error)] bg-[var(--color-error)]/10 p-3 rounded-lg">{error}</p>}

      <div className="pt-2">
        <Button type="submit" disabled={loading} className="h-12 px-8 rounded-xl font-bold bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 gap-2 shadow-sm text-[0.9375rem]">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span>Send Message</span>
        </Button>
      </div>
    </form>
  );
}

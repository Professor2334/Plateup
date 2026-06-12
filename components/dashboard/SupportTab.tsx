import { ContactForm } from '@/components/contact/ContactForm';

interface SupportTabProps {
  email: string;
}

export function SupportTab({ email }: SupportTabProps) {
  return (
    <div className="animate-in fade-in duration-300 max-w-3xl pt-2">
      <div className="mb-10">
        <h2 className="text-2xl font-extrabold text-[var(--color-on-surface)] tracking-tight mb-3">Contact Support</h2>
        <p className="text-[15px] font-medium text-[var(--color-on-surface-variant)] leading-relaxed">
          Use this form to send us a message, or email us directly at{' '}
          <a href="mailto:support@plateup.app" className="text-[var(--color-primary)] hover:underline font-semibold">
            support@plateup.app
          </a>.
        </p>
        <div className="mt-6 bg-[var(--color-surface-container)] p-5 rounded-2xl border border-[var(--color-outline-variant)]/30 shadow-sm">
          <p className="text-[14px] font-medium text-[var(--color-on-surface-variant)] leading-relaxed">
            We'll send an immediate email confirmation that we got your message. We usually respond same-day, but it can sometimes take us one to two business days to get back to you.
          </p>
        </div>
      </div>
      <ContactForm defaultEmail={email} />
    </div>
  );
}

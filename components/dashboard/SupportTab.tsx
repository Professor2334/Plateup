/* eslint-disable react/no-unescaped-entities */
import { ContactForm } from '@/components/contact/ContactForm';

interface SupportTabProps {
  email: string;
  isScrolled?: boolean;
}

export function SupportTab({ email, isScrolled = false }: SupportTabProps) {
  return (
    <div className="animate-in fade-in duration-300 pb-12 relative w-full">
      <div className={`sticky top-[-24px] lg:top-[-32px] z-40 -mx-4 lg:-mx-14 px-4 lg:px-14 pt-6 lg:pt-8 pb-4 mb-6 transition-all duration-500 ease-in-out ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.02)]' : 'bg-[#f9fafb]'}`}>
        <div className="max-w-3xl">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className={`font-bold text-[var(--color-on-surface)] tracking-tight transition-all duration-500 ease-in-out origin-left ${isScrolled ? 'text-[clamp(1.125rem,2vw,1.25rem)] scale-95' : 'text-[clamp(1.5rem,3vw+0.5rem,1.875rem)] scale-100'}`}>Contact Support</h2>
            </div>
            
            <div className={`grid transition-all duration-500 ease-in-out ${isScrolled ? 'grid-rows-[0fr] opacity-0 mb-0' : 'grid-rows-[1fr] opacity-100 mt-2'}`}>
              <div className="overflow-hidden">
                <p className="text-[0.9375rem] font-medium text-[var(--color-on-surface-variant)] leading-relaxed">
                  Use the contact form below to reach our team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl">
        <div className="mb-8 bg-[var(--color-surface-container)] p-5 rounded-2xl border border-[var(--color-outline-variant)]/30 shadow-sm">
          <p className="text-[0.875rem] font-medium text-[var(--color-on-surface-variant)] leading-relaxed">
            We'll send an immediate email confirmation that we got your message. We usually respond same-day, but it can sometimes take us one to two business days to get back to you.
          </p>
        </div>
        <ContactForm defaultEmail={email} />
      </div>
    </div>
  );
}

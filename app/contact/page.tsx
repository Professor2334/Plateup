/* eslint-disable react/no-unescaped-entities */
import { auth } from '@/lib/auth';
import { ContactForm } from '@/components/contact/ContactForm';
import { PlateUpLogo } from '@/components/shared/PlateUpLogo';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the PlateUp team for support, partnerships, or general inquiries about our AI meal planner.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Us | PlateUp',
    description: 'Get in touch with the PlateUp team for support, partnerships, or general inquiries about our AI meal planner.',
    url: 'https://plateup.com.ng/contact',
  },
  twitter: {
    title: 'Contact Us | PlateUp',
    description: 'Get in touch with the PlateUp team for support, partnerships, or general inquiries about our AI meal planner.',
  },
};

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const session = await auth();
  const userEmail = session?.user?.email || null;

  return (
    <div className="min-h-screen bg-[var(--color-surface-container-lowest)] flex flex-col">
      <header className="h-20 bg-[var(--color-surface)] flex items-center px-6 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
          <PlateUpLogo size="sm" href="/" />
          <Link href="/" className="flex items-center gap-2 text-[14px] font-bold text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-[700px] mx-auto w-full px-6 py-16 md:py-24">
        <div className="mb-12">
          <h1 className="text-[32px] md:text-[40px] font-extrabold text-[var(--color-on-surface)] tracking-tight mb-4">Contact Us</h1>
          <p className="text-[16px] font-medium text-[var(--color-on-surface-variant)] leading-relaxed">
            Use the contact form below to reach our team.
          </p>
          <p className="text-[14px] font-medium text-[var(--color-on-surface-variant)] leading-relaxed mt-4 opacity-80">
            We'll send an immediate email confirmation that we got your message. We usually respond same-day, but it can sometimes take us one to two business days to get back to you.
          </p>
        </div>

        <ContactForm defaultEmail={userEmail} />
      </main>
    </div>
  );
}

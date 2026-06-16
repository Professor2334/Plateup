import Link from 'next/link';
import { PlateUpLogo } from '@/components/shared/PlateUpLogo';
import { ArrowLeft } from 'lucide-react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Read the PlateUp Terms of Service. Understand your rights and responsibilities when using our AI-powered Nigerian meal planning platform.',
  alternates: { canonical: '/terms' },
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-container-lowest)] flex flex-col">
      {/* Simple Header */}
      <header className="h-20 bg-[var(--color-surface)] flex items-center px-6 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
          <PlateUpLogo size="sm" href="/" />
          <Link href="/" className="flex items-center gap-2 text-[14px] font-bold text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Table of Contents (Desktop) */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-32 space-y-4">
              <h4 className="text-[12px] font-bold tracking-widest text-[var(--color-on-surface-variant)] uppercase">Table of Contents</h4>
              <nav className="flex flex-col space-y-3">
                <a href="#acceptance" className="text-[14px] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">1. Acceptance of Terms</a>
                <a href="#user-accounts" className="text-[14px] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">2. User Accounts</a>
                <a href="#acceptable-use" className="text-[14px] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">3. Acceptable Use</a>
                <a href="#ai-disclaimer" className="text-[14px] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">4. AI Content Disclaimer</a>
                <a href="#service-availability" className="text-[14px] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">5. Service Availability</a>
                <a href="#intellectual-property" className="text-[14px] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">6. Intellectual Property</a>
                <a href="#limitation-of-liability" className="text-[14px] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">7. Limitation of Liability</a>
                <a href="#contact" className="text-[14px] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">8. Contact Information</a>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 max-w-2xl prose prose-slate">
            <div className="mb-12">
              <h1 className="text-[36px] md:text-[48px] font-extrabold text-[var(--color-on-surface)] tracking-tight leading-tight mb-4">Terms of Service</h1>
              <p className="text-[15px] font-medium text-[var(--color-on-surface-variant)]">Last updated: June 11, 2026</p>
            </div>

            <div className="space-y-10 text-[16px] text-[var(--color-on-surface-variant)] leading-relaxed">
              <p>
                Welcome to PlateUp. These Terms of Service ("Terms") govern your use of the PlateUp application and website. By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy.
              </p>

              <section id="acceptance">
                <h2 className="text-[24px] font-bold text-[var(--color-on-surface)] mb-4">1. Acceptance of Terms</h2>
                <p>By creating an account, accessing, or using PlateUp, you agree to comply with and be bound by these Terms. If you do not agree to these Terms, you may not use our services.</p>
              </section>

              <section id="user-accounts">
                <h2 className="text-[24px] font-bold text-[var(--color-on-surface)] mb-4">2. User Accounts</h2>
                <p className="mb-4">To use most features of PlateUp, you must register for an account. You agree to:</p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>Provide accurate, current, and complete account information.</li>
                  <li>Maintain the security of your password and accept all risks of unauthorized access to your account.</li>
                  <li>Promptly notify us if you discover or suspect any security breaches related to your account.</li>
                  <li>Verify your email address before gaining full access to protected functionality.</li>
                </ul>
              </section>

              <section id="acceptable-use">
                <h2 className="text-[24px] font-bold text-[var(--color-on-surface)] mb-4">3. Acceptable Use</h2>
                <p className="mb-4">You agree not to use PlateUp for any unlawful or prohibited purpose. You must not:</p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>Attempt to bypass or circumvent any rate limits or security features.</li>
                  <li>Use the service to generate malicious, offensive, or inappropriate content.</li>
                  <li>Reverse engineer or attempt to extract the source code of the application.</li>
                  <li>Interfere with or disrupt the integrity or performance of the service.</li>
                </ul>
              </section>

              <section id="ai-disclaimer">
                <h2 className="text-[24px] font-bold text-[var(--color-on-surface)] mb-4">4. AI Generated Content Disclaimer</h2>
                <p>PlateUp uses artificial intelligence (powered by DeepSeek) to generate meal plans and shopping lists. While we strive to provide accurate, budget-friendly, and culturally relevant Nigerian meal suggestions, we cannot guarantee the complete accuracy, safety, or nutritional adequacy of the generated plans. The content is provided for informational and planning purposes only. You are solely responsible for ensuring your meals meet your personal dietary requirements and for verifying market prices.</p>
              </section>

              <section id="service-availability">
                <h2 className="text-[24px] font-bold text-[var(--color-on-surface)] mb-4">5. Service Availability</h2>
                <p>We reserve the right to modify, suspend, or discontinue PlateUp (or any part of it) at any time, with or without notice. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the service.</p>
              </section>

              <section id="intellectual-property">
                <h2 className="text-[24px] font-bold text-[var(--color-on-surface)] mb-4">6. Intellectual Property</h2>
                <p>The PlateUp application, including its original content, design, logo, and features, is owned by PlateUp and is protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>
              </section>

              <section id="limitation-of-liability">
                <h2 className="text-[24px] font-bold text-[var(--color-on-surface)] mb-4">7. Limitation of Liability</h2>
                <p>In no event shall PlateUp, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>
              </section>

              <section id="contact">
                <h2 className="text-[24px] font-bold text-[var(--color-on-surface)] mb-4">8. Contact Information</h2>
                <p>If you have any questions about these Terms, please contact us at:</p>
                <p className="mt-2 font-medium text-[var(--color-on-surface)]">legal@plateup.com</p>
              </section>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

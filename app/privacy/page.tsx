import Link from 'next/link';
import { PlateUpLogo } from '@/components/shared/PlateUpLogo';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | PlateUp',
  description: 'Privacy Policy for PlateUp, the AI-powered meal planning engine.',
};

export default function PrivacyPolicyPage() {
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
                <a href="#information-we-collect" className="text-[14px] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">1. Information We Collect</a>
                <a href="#how-we-use" className="text-[14px] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">2. How We Use Information</a>
                <a href="#data-storage" className="text-[14px] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">3. Data Storage & Security</a>
                <a href="#email-communications" className="text-[14px] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">4. Email Communications</a>
                <a href="#third-party" className="text-[14px] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">5. Third-Party Services</a>
                <a href="#user-rights" className="text-[14px] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">6. User Rights</a>
                <a href="#contact" className="text-[14px] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">7. Contact Information</a>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 max-w-2xl prose prose-slate">
            <div className="mb-12">
              <h1 className="text-[36px] md:text-[48px] font-extrabold text-[var(--color-on-surface)] tracking-tight leading-tight mb-4">Privacy Policy</h1>
              <p className="text-[15px] font-medium text-[var(--color-on-surface-variant)]">Last updated: June 11, 2026</p>
            </div>

            <div className="space-y-10 text-[16px] text-[var(--color-on-surface-variant)] leading-relaxed">
              <p>
                At PlateUp, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
              </p>

              <section id="information-we-collect">
                <h2 className="text-[24px] font-bold text-[var(--color-on-surface)] mb-4">1. Information We Collect</h2>
                <p className="mb-4">We collect information that you voluntarily provide to us when you register on the application, express an interest in obtaining information about us or our products and services, or otherwise when you contact us. This includes:</p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li><strong>Personal Data:</strong> Name, email address, and authentication credentials.</li>
                  <li><strong>Application Data:</strong> Information regarding your household size, budget constraints, and available ingredients used to generate meal plans.</li>
                  <li><strong>Usage Data:</strong> We may automatically collect information about how you access and use the platform.</li>
                </ul>
              </section>

              <section id="how-we-use">
                <h2 className="text-[24px] font-bold text-[var(--color-on-surface)] mb-4">2. How We Use Information</h2>
                <p className="mb-4">Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the application to:</p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>Create and manage your account.</li>
                  <li>Generate AI-powered meal plans and shopping lists tailored to your inputs.</li>
                  <li>Email you regarding your account or order (e.g., verification emails, password resets).</li>
                  <li>Monitor and analyze usage and trends to improve your experience with the application.</li>
                </ul>
              </section>

              <section id="data-storage">
                <h2 className="text-[24px] font-bold text-[var(--color-on-surface)] mb-4">3. Data Storage & Security</h2>
                <p>We use administrative, technical, and physical security measures to help protect your personal information. Your data is securely stored in our managed PostgreSQL database. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
              </section>

              <section id="email-communications">
                <h2 className="text-[24px] font-bold text-[var(--color-on-surface)] mb-4">4. Email Communications</h2>
                <p>We send necessary transactional emails such as email verification and password resets. By creating an account, you consent to receive these essential communications. We do not sell your email address to third parties or send unsolicited marketing emails without your explicit consent.</p>
              </section>

              <section id="third-party">
                <h2 className="text-[24px] font-bold text-[var(--color-on-surface)] mb-4">5. Third-Party Services</h2>
                <p className="mb-4">We rely on carefully selected third-party service providers to operate PlateUp securely and efficiently. These include:</p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li><strong>Neon:</strong> Provides our hosted PostgreSQL database infrastructure.</li>
                  <li><strong>Resend:</strong> Handles the secure delivery of transactional emails.</li>
                  <li><strong>DeepSeek API:</strong> Powers our AI meal generation engine. Please note that the ingredients and budgets you input are sent to DeepSeek for processing.</li>
                  <li><strong>Vercel:</strong> Hosts our application architecture.</li>
                </ul>
                <p>These services have their own privacy policies governing how they handle data.</p>
              </section>

              <section id="user-rights">
                <h2 className="text-[24px] font-bold text-[var(--color-on-surface)] mb-4">6. User Rights</h2>
                <p>Depending on your location, you may have certain rights regarding your personal data, including the right to access, correct, or delete your information. You can manage your account information directly within the PlateUp dashboard. To request complete account deletion, please contact us using the information provided below.</p>
              </section>

              <section id="contact">
                <h2 className="text-[24px] font-bold text-[var(--color-on-surface)] mb-4">7. Contact Information</h2>
                <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
                <p className="mt-2 font-medium text-[var(--color-on-surface)]">support@plateup.com</p>
              </section>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

interface PrivacyTabProps {
  isScrolled?: boolean;
}

export function PrivacyTab({ isScrolled = false }: PrivacyTabProps) {
  return (
    <div className="animate-in fade-in duration-300 pb-12 relative w-full">
      <div className={`sticky top-[-24px] lg:top-[-32px] z-40 -mx-4 lg:-mx-14 px-4 lg:px-14 pt-6 lg:pt-8 pb-4 mb-6 transition-all duration-500 ease-in-out ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.02)]' : 'bg-[#f9fafb]'}`}>
        <div className="max-w-4xl">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className={`font-bold text-[var(--color-on-surface)] tracking-tight transition-all duration-500 ease-in-out origin-left ${isScrolled ? 'text-[clamp(1.125rem,2vw,1.25rem)] scale-95' : 'text-[clamp(1.5rem,3vw+0.5rem,1.875rem)] scale-100'}`}>Privacy Policy</h2>
            </div>
            
            <div className={`grid transition-all duration-500 ease-in-out ${isScrolled ? 'grid-rows-[0fr] opacity-0 mb-0' : 'grid-rows-[1fr] opacity-100 mt-2'}`}>
              <div className="overflow-hidden">
                <p className="text-[0.875rem] font-medium text-[var(--color-on-surface-variant)] opacity-70">Last updated: June 11, 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-12 max-w-4xl">
        <div className="flex-1 max-w-2xl prose prose-slate">

          <div className="space-y-10 text-[0.9375rem] text-[var(--color-on-surface-variant)] leading-relaxed">
            <p>
              At PlateUp, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>

            <section id="information-we-collect">
              <h3 className="text-[1.25rem] font-bold text-[var(--color-on-surface)] mb-4">1. Information We Collect</h3>
              <p className="mb-4">We collect information that you voluntarily provide to us when you register on the application, express an interest in obtaining information about us or our products and services, or otherwise when you contact us. This includes:</p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li><strong>Personal Data:</strong> Name, email address, and authentication credentials.</li>
                <li><strong>Application Data:</strong> Information regarding your household size, budget constraints, and available ingredients used to generate meal plans.</li>
                <li><strong>Usage Data:</strong> We may automatically collect information about how you access and use the platform.</li>
              </ul>
            </section>

            <section id="how-we-use">
              <h3 className="text-[1.25rem] font-bold text-[var(--color-on-surface)] mb-4">2. How We Use Information</h3>
              <p className="mb-4">Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the application to:</p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Create and manage your account.</li>
                <li>Generate AI-powered meal plans and shopping lists tailored to your inputs.</li>
                <li>Email you regarding your account or order (e.g., verification emails, password resets).</li>
                <li>Monitor and analyze usage and trends to improve your experience with the application.</li>
              </ul>
            </section>

            <section id="data-storage">
              <h3 className="text-[1.25rem] font-bold text-[var(--color-on-surface)] mb-4">3. Data Storage & Security</h3>
              <p>We use administrative, technical, and physical security measures to help protect your personal information. Your data is securely stored in our managed PostgreSQL database. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
            </section>

            <section id="email-communications">
              <h3 className="text-[1.25rem] font-bold text-[var(--color-on-surface)] mb-4">4. Email Communications</h3>
              <p>We send necessary transactional emails such as email verification and password resets. By creating an account, you consent to receive these essential communications. We do not sell your email address to third parties or send unsolicited marketing emails without your explicit consent.</p>
            </section>

            <section id="third-party">
              <h3 className="text-[1.25rem] font-bold text-[var(--color-on-surface)] mb-4">5. Third-Party Services</h3>
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
              <h3 className="text-[1.25rem] font-bold text-[var(--color-on-surface)] mb-4">6. User Rights</h3>
              <p>Depending on your location, you may have certain rights regarding your personal data, including the right to access, correct, or delete your information. You can manage your account information directly within the PlateUp dashboard. To request complete account deletion, please contact us using the information provided below.</p>
            </section>

            <section id="contact">
              <h3 className="text-[1.25rem] font-bold text-[var(--color-on-surface)] mb-4">7. Contact Information</h3>
              <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
              <p className="mt-2 font-medium text-[var(--color-primary)]">support@plateup.com</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

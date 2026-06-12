export function TermsTab() {
  return (
    <div className="animate-in fade-in duration-300 max-w-4xl pt-2">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Content */}
        <div className="flex-1 max-w-2xl prose prose-slate">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-[var(--color-on-surface)] tracking-tight leading-tight mb-3">Terms of Service</h2>
            <p className="text-[14px] font-medium text-[var(--color-on-surface-variant)] opacity-70">Last updated: June 11, 2026</p>
          </div>

          <div className="space-y-10 text-[15px] text-[var(--color-on-surface-variant)] leading-relaxed">
            <p>
              Welcome to PlateUp. These Terms of Service ("Terms") govern your use of the PlateUp application and website. By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy.
            </p>

            <section id="acceptance">
              <h3 className="text-[20px] font-bold text-[var(--color-on-surface)] mb-4">1. Acceptance of Terms</h3>
              <p>By creating an account, accessing, or using PlateUp, you agree to comply with and be bound by these Terms. If you do not agree to these Terms, you may not use our services.</p>
            </section>

            <section id="user-accounts">
              <h3 className="text-[20px] font-bold text-[var(--color-on-surface)] mb-4">2. User Accounts</h3>
              <p className="mb-4">To use most features of PlateUp, you must register for an account. You agree to:</p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Provide accurate, current, and complete account information.</li>
                <li>Maintain the security of your password and accept all risks of unauthorized access to your account.</li>
                <li>Promptly notify us if you discover or suspect any security breaches related to your account.</li>
                <li>Verify your email address before gaining full access to protected functionality.</li>
              </ul>
            </section>

            <section id="acceptable-use">
              <h3 className="text-[20px] font-bold text-[var(--color-on-surface)] mb-4">3. Acceptable Use</h3>
              <p className="mb-4">You agree not to use PlateUp for any unlawful or prohibited purpose. You must not:</p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Attempt to bypass or circumvent any rate limits or security features.</li>
                <li>Use the service to generate malicious, offensive, or inappropriate content.</li>
                <li>Reverse engineer or attempt to extract the source code of the application.</li>
                <li>Interfere with or disrupt the integrity or performance of the service.</li>
              </ul>
            </section>

            <section id="ai-disclaimer">
              <h3 className="text-[20px] font-bold text-[var(--color-on-surface)] mb-4">4. AI Generated Content Disclaimer</h3>
              <p>PlateUp uses artificial intelligence (powered by DeepSeek) to generate meal plans and shopping lists. While we strive to provide accurate, budget-friendly, and culturally relevant Nigerian meal suggestions, we cannot guarantee the complete accuracy, safety, or nutritional adequacy of the generated plans. The content is provided for informational and planning purposes only. You are solely responsible for ensuring your meals meet your personal dietary requirements and for verifying market prices.</p>
            </section>

            <section id="service-availability">
              <h3 className="text-[20px] font-bold text-[var(--color-on-surface)] mb-4">5. Service Availability</h3>
              <p>We reserve the right to modify, suspend, or discontinue PlateUp (or any part of it) at any time, with or without notice. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the service.</p>
            </section>

            <section id="intellectual-property">
              <h3 className="text-[20px] font-bold text-[var(--color-on-surface)] mb-4">6. Intellectual Property</h3>
              <p>The PlateUp application, including its original content, design, logo, and features, is owned by PlateUp and is protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>
            </section>

            <section id="limitation-of-liability">
              <h3 className="text-[20px] font-bold text-[var(--color-on-surface)] mb-4">7. Limitation of Liability</h3>
              <p>In no event shall PlateUp, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>
            </section>

            <section id="contact">
              <h3 className="text-[20px] font-bold text-[var(--color-on-surface)] mb-4">8. Contact Information</h3>
              <p>If you have any questions about these Terms, please contact us at:</p>
              <p className="mt-2 font-medium text-[var(--color-primary)]">legal@plateup.com</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

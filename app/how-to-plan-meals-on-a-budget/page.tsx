/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import type { Metadata } from 'next';
import { PlateUpLogo } from '@/components/shared/PlateUpLogo';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How to Plan Meals on a Budget | Practical Nigerian Guide',
  description: 'Discover how to plan meals on a budget in Nigeria. Our step-by-step guide and AI meal planner will help you save money and eat well every single week.',
  alternates: { canonical: '/how-to-plan-meals-on-a-budget' },
  openGraph: {
    title: 'How to Plan Meals on a Budget | Practical Nigerian Guide',
    description: 'Discover how to plan meals on a budget in Nigeria. Our step-by-step guide and AI meal planner will help you save money and eat well every single week.',
    url: 'https://plateup.com.ng/how-to-plan-meals-on-a-budget',
  },
};

export default function HowToPlanMealsOnABudgetPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-container-lowest)] flex flex-col font-sans">
      
      {/* Header */}
      <header className="h-20 bg-[var(--color-surface)] flex items-center px-6 sticky top-0 z-50 ring-1 ring-black/[0.02]">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <PlateUpLogo size="sm" href="/" />
          <div className="hidden md:flex gap-6">
            <Link href="/budget-meal-planner-nigeria" className="text-[14px] font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)]">Budget Planner</Link>
            <Link href="/weekly-food-budget-guide" className="text-[14px] font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)]">Budget Guide</Link>
          </div>
          <Link href="/auth/register" className="h-10 px-5 bg-[var(--color-primary)] text-white font-bold rounded-xl flex items-center justify-center text-[14px] shadow-sm hover:shadow-md transition-all">
            Start Planning
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="py-20 md:py-32 px-6 bg-[#f9fafb] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-50"></div>
          <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 ring-1 ring-purple-100 mb-4">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
              <span className="text-xs font-bold text-purple-800 tracking-wider uppercase">Step-by-Step System</span>
            </div>
            <h1 className="text-[40px] md:text-[64px] font-extrabold text-[#1a1a1a] tracking-tight leading-[1.1]">
              How to <span className="text-[var(--color-primary)]">Plan Meals on a Budget</span>
            </h1>
            <p className="text-[18px] md:text-[22px] font-medium text-[#4a4a4a] max-w-2xl mx-auto leading-relaxed">
              Eating well in Nigeria does not require an unlimited budget. Learn the systematic approach to organizing your kitchen and your wallet.
            </p>
            <div className="pt-6">
              <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-[var(--color-primary)] text-white text-[16px] font-extrabold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                Automate Your Planning
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 px-6 max-w-4xl mx-auto">
          <article className="prose prose-lg prose-slate max-w-none text-[17px] leading-[1.8] text-[#4a4a4a]">
            <h2 className="text-[28px] font-bold text-[#1a1a1a] mb-6">The Real Secret to Eating Well on Less</h2>
            <p className="mb-6">
              Most people believe that to eat well, you must spend a lot of money. However, if you observe households that manage their finances properly, you will notice one common trait: they do not rely on chance when it comes to their food. They know exactly <strong>how to plan meals on a budget</strong>.
            </p>
            
            <p className="mb-6">
              In Nigeria, where the prices of tomatoes, onions, and proteins fluctuate dramatically, relying on daily, spontaneous market runs is a guaranteed way to exhaust your funds. To survive and thrive, you must adopt a systematic approach to your kitchen.
            </p>

            <h3 className="text-[24px] font-bold text-[#1a1a1a] mt-10 mb-4">Phase 1: The Kitchen Audit</h3>
            <p className="mb-6">
              The first step in any effective <strong>food budget planner Nigeria</strong> strategy is to know what you already own. Before you write a single item on your market list, audit your pantry. Look in the back of your cabinets. Do you have half a bag of beans? Two cups of garri? Some dried fish in the freezer?
            </p>
            <p className="mb-6">
              By using what you already have, you immediately slash your weekly grocery bill. PlateUp is designed with this exact philosophy in mind. You can enter your existing pantry ingredients into the app, and the AI will build your menu around them.
            </p>

            <h3 className="text-[24px] font-bold text-[#1a1a1a] mt-10 mb-4">Phase 2: Master the Art of Substitution</h3>
            <p className="mb-6">
              A rigid recipe is the enemy of a tight budget. If a recipe calls for expensive goat meat, but chicken is cheaper at the market that day, you must be willing to substitute. 
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10 not-prose">
              <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/[0.03]">
                <h4 className="text-[18px] font-bold text-[var(--color-primary)] mb-2">Protein Substitutes</h4>
                <p className="text-[15px] text-[#4a4a4a]">Replace beef with soya chunks, eggs, or affordable fish (like Titus or Kote). Beans also serve as an excellent base protein.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/[0.03]">
                <h4 className="text-[18px] font-bold text-[var(--color-primary)] mb-2">Vegetable Substitutes</h4>
                <p className="text-[15px] text-[#4a4a4a]">If Ugu is too expensive, consider alternatives like Waterleaf, Spinach (Green), or Scent leaf depending on the soup you are making.</p>
              </div>
            </div>

            <h3 className="text-[24px] font-bold text-[#1a1a1a] mt-10 mb-4">Phase 3: The Power of the AI Meal Planner Nigeria</h3>
            <p className="mb-6">
              Manually calculating costs and designing a 7-day menu that utilizes shared ingredients is difficult. This is where technology steps in. Using an <strong>AI meal planner Nigeria</strong> platform like PlateUp automates this entire cognitive process.
            </p>
            <p className="mb-6">
              When you set up your PlateUp profile, you simply tell the system: "I have ₦15,000 for the week for 3 people, and I have rice and palm oil at home."
            </p>
            <p className="mb-6">
              Within seconds, the <strong>weekly meal planner Nigeria</strong> algorithm will produce a breakfast, lunch, and dinner schedule. It will intentionally overlap ingredients—for example, suggesting you buy a large bunch of spinach to use in both Efo Riro on Tuesday and Yam porridge on Thursday, preventing waste.
            </p>

            <h3 className="text-[24px] font-bold text-[#1a1a1a] mt-10 mb-4">Phase 4: Stick to the Automated List</h3>
            <p className="mb-6">
              The final, and most crucial step in learning <strong>how to plan meals on a budget</strong>, is discipline at the market. PlateUp will generate a categorized shopping list for you. Send this list to your WhatsApp and do not deviate from it. The supermarkets and open markets are designed to make you buy things you do not need. Your AI-generated list is your armor against impulse buying.
            </p>
            <p className="mb-6">
              By following these four phases, you will immediately notice a reduction in your monthly food expenses and an increase in the variety and quality of the meals you eat at home.
            </p>
          </article>
        </section>

        {/* CTA Banner */}
        <section className="py-16 px-6 max-w-4xl mx-auto">
          <div className="bg-[var(--color-primary)] rounded-[32px] p-10 md:p-14 text-center shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white opacity-10 rounded-full blur-[60px] transform translate-x-1/2 -translate-y-1/2"></div>
            <h2 className="text-[32px] font-extrabold text-white mb-4 relative z-10">Stop guessing. Start planning.</h2>
            <p className="text-[18px] text-white/90 mb-8 max-w-lg mx-auto relative z-10">Let PlateUp handle the mathematics of your kitchen while you enjoy the food.</p>
            <Link href="/auth/register" className="inline-flex items-center justify-center h-14 px-8 rounded-xl bg-white text-[var(--color-primary)] text-[16px] font-bold shadow-sm hover:shadow-md transition-all relative z-10">
              Get Your Automated Meal Plan
            </Link>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 px-6 max-w-3xl mx-auto border-t border-black/[0.05]">
          <h2 className="text-[32px] font-extrabold text-[#1a1a1a] text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/[0.03]">
              <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-2">Do I need to be a good cook to use PlateUp?</h3>
              <p className="text-[15px] text-[#4a4a4a] leading-relaxed">Not at all! The AI focuses on standard, well-known Nigerian dishes. It provides the structure; you just follow the plan.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/[0.03]">
              <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-2">Can it help me plan meals for a large family?</h3>
              <p className="text-[15px] text-[#4a4a4a] leading-relaxed">Yes. PlateUp's AI naturally scales recommendations based on the household size you define during your onboarding.</p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white py-10 border-t border-black/[0.05]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <PlateUpLogo size="sm" href="/" />
          <p className="text-[14px] text-[#4a4a4a]">© {new Date().getFullYear()} PlateUp AI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-[14px] font-medium text-[#4a4a4a] hover:text-[var(--color-primary)]">Privacy Policy</Link>
            <Link href="/terms" className="text-[14px] font-medium text-[#4a4a4a] hover:text-[var(--color-primary)]">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

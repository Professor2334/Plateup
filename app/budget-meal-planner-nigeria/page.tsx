/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import type { Metadata } from 'next';
import { PlateUpLogo } from '@/components/shared/PlateUpLogo';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Budget Meal Planner Nigeria | Cut Your Food Costs',
  description: 'Learn how to plan affordable Nigerian meals. Our AI budget meal planner helps you eat well while saving money on your weekly market runs in Nigeria.',
  alternates: { canonical: '/budget-meal-planner-nigeria' },
  openGraph: {
    title: 'Budget Meal Planner Nigeria | Cut Your Food Costs',
    description: 'Learn how to plan affordable Nigerian meals. Our AI budget meal planner helps you eat well while saving money on your weekly market runs in Nigeria.',
    url: 'https://plateup.com.ng/budget-meal-planner-nigeria',
  },
};

export default function BudgetMealPlannerNigeriaPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-container-lowest)] flex flex-col font-sans">
      
      {/* Header */}
      <header className="h-20 bg-[var(--color-surface)] flex items-center px-6 sticky top-0 z-50 ring-1 ring-black/[0.02]">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <PlateUpLogo size="sm" href="/" />
          <div className="hidden md:flex gap-6">
            <Link href="/nigerian-meal-planner" className="text-[14px] font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)]">AI Planner</Link>
            <Link href="/meal-planning-for-students" className="text-[14px] font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)]">For Students</Link>
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 ring-1 ring-green-100 mb-4">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-bold text-green-800 tracking-wider uppercase">Save Money on Groceries</span>
            </div>
            <h1 className="text-[40px] md:text-[64px] font-extrabold text-[#1a1a1a] tracking-tight leading-[1.1]">
              The <span className="text-[var(--color-primary)]">Budget Meal Planner</span> for Nigeria
            </h1>
            <p className="text-[18px] md:text-[22px] font-medium text-[#4a4a4a] max-w-2xl mx-auto leading-relaxed">
              Stop overspending at the market. Our AI-driven budget meal planner analyzes your spending limits and generates affordable Nigerian meal plans automatically.
            </p>
            <div className="pt-6">
              <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-[var(--color-primary)] text-white text-[16px] font-extrabold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                Create Your Budget Plan
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 px-6 max-w-4xl mx-auto">
          <article className="prose prose-lg prose-slate max-w-none text-[17px] leading-[1.8] text-[#4a4a4a]">
            <h2 className="text-[28px] font-bold text-[#1a1a1a] mb-6">Navigating the High Cost of Food in Nigeria</h2>
            <p className="mb-6">
              With market prices fluctuating constantly, managing a household budget in Nigeria requires extreme precision. The cost of basic staples—like rice, beans, garri, and palm oil—has made it necessary for families to seek alternative ways to feed themselves without compromising on nutritional quality. This is exactly where a reliable <strong>budget meal planner Nigeria</strong> becomes your best defense against inflation.
            </p>
            
            <p className="mb-6">
              Many families fall into the trap of buying ingredients on impulse, which leads to food waste and depleted budgets before the month ends. The secret to cutting down costs is strategic planning. By knowing exactly what you will eat for the next seven days, you only buy what you need.
            </p>

            <h3 className="text-[24px] font-bold text-[#1a1a1a] mt-10 mb-4">How PlateUp Solves Your Budget Problems</h3>
            <p className="mb-6">
              PlateUp is not just an ordinary recipe app; it is a sophisticated <strong>AI meal planner Nigeria</strong> tool that mathematically aligns your food cravings with your wallet. We introduced dynamic portion costing to ensure that every single meal suggested by our system actually fits your declared budget.
            </p>
            
            <p className="mb-6">
              When you use PlateUp, you enter your weekly budget, your household size, and any ingredients you already have at home. The AI will then act as your personal financial food advisor. If your budget is particularly tight, the AI will automatically exclude expensive proteins like beef or goat meat and suggest highly nutritious, affordable alternatives like eggs, soya beans, or locally sourced fish.
            </p>

            <h3 className="text-[24px] font-bold text-[#1a1a1a] mt-10 mb-4">Three Rules for a Food Budget Planner Nigeria</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">
              <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/[0.03]">
                <div className="text-[24px] font-bold text-[var(--color-primary)] mb-4">01</div>
                <h4 className="text-[18px] font-bold text-[#1a1a1a] mb-2">Pantry-First Approach</h4>
                <p className="text-[15px] text-[#4a4a4a]">Always plan your meals around the non-perishables and frozen items you already have. PlateUp forces you to use these before buying more.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/[0.03]">
                <div className="text-[24px] font-bold text-[var(--color-primary)] mb-4">02</div>
                <h4 className="text-[18px] font-bold text-[#1a1a1a] mb-2">Strict Market Lists</h4>
                <p className="text-[15px] text-[#4a4a4a]">Never go to the market without a generated list. PlateUp groups your ingredients logically so you can shop quickly and resist impulse buys.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/[0.03]">
                <div className="text-[24px] font-bold text-[var(--color-primary)] mb-4">03</div>
                <h4 className="text-[18px] font-bold text-[#1a1a1a] mb-2">Protein Substitution</h4>
                <p className="text-[15px] text-[#4a4a4a]">Learn to alternate proteins based on market prices. Our AI handles this automatically, ensuring you stay within your limits.</p>
              </div>
            </div>

            <h3 className="text-[24px] font-bold text-[#1a1a1a] mt-10 mb-4">The Role of a Weekly Meal Planner Nigeria</h3>
            <p className="mb-6">
              A <strong>weekly meal planner Nigeria</strong> is not a luxury; it is a necessity for financial stability. Think about the amount of money spent on ordering food just because you were too tired to figure out what to cook. By having a clear schedule generated by PlateUp, you eliminate decision fatigue. You know exactly what needs to be prepped in the morning and what needs to be cooked in the evening.
            </p>
            <p className="mb-6">
              Join the smart Nigerian families who are taking back control of their finances through intelligent meal planning. Let the AI do the calculations while you enjoy delicious, affordable meals.
            </p>
          </article>
        </section>

        {/* CTA Banner */}
        <section className="py-16 px-6 max-w-4xl mx-auto">
          <div className="bg-[var(--color-primary)] rounded-[32px] p-10 md:p-14 text-center shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white opacity-10 rounded-full blur-[60px] transform translate-x-1/2 -translate-y-1/2"></div>
            <h2 className="text-[32px] font-extrabold text-white mb-4 relative z-10">Start Saving Money Today.</h2>
            <p className="text-[18px] text-white/90 mb-8 max-w-lg mx-auto relative z-10">Use our AI budget meal planner to cut your grocery costs immediately.</p>
            <Link href="/auth/register" className="inline-flex items-center justify-center h-14 px-8 rounded-xl bg-white text-[var(--color-primary)] text-[16px] font-bold shadow-sm hover:shadow-md transition-all relative z-10">
              Try PlateUp for Free
            </Link>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 px-6 max-w-3xl mx-auto border-t border-black/[0.05]">
          <h2 className="text-[32px] font-extrabold text-[#1a1a1a] text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/[0.03]">
              <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-2">How does PlateUp know what is affordable?</h3>
              <p className="text-[15px] text-[#4a4a4a] leading-relaxed">Our AI uses dynamic cost-per-portion calculations based on your household size. If the resulting cost per meal is very low, it restricts expensive ingredients from the generated plan.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/[0.03]">
              <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-2">Can I use PlateUp if I only have a small budget?</h3>
              <p className="text-[15px] text-[#4a4a4a] leading-relaxed">Yes! PlateUp is designed to accommodate extremely tight budgets. It will suggest filling, highly nutritious staple foods to ensure you don't go hungry.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/[0.03]">
              <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-2">Does it provide a shopping list?</h3>
              <p className="text-[15px] text-[#4a4a4a] leading-relaxed">Every generated meal plan automatically comes with a corresponding shopping list that you can copy to your clipboard or send to WhatsApp.</p>
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

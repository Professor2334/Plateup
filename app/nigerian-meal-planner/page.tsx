/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import type { Metadata } from 'next';
import { PlateUpLogo } from '@/components/shared/PlateUpLogo';
import { ArrowRight, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Nigerian Meal Planner | AI-Powered Weekly Food Plans',
  description: 'The ultimate Nigerian meal planner. Generate budget-friendly weekly food plans using authentic Nigerian recipes, pantry ingredients, and smart shopping lists.',
  alternates: { canonical: '/nigerian-meal-planner' },
  openGraph: {
    title: 'Nigerian Meal Planner | AI-Powered Weekly Food Plans',
    description: 'The ultimate Nigerian meal planner. Generate budget-friendly weekly food plans using authentic Nigerian recipes, pantry ingredients, and smart shopping lists.',
    url: 'https://plateup.com.ng/nigerian-meal-planner',
  },
};

export default function NigerianMealPlannerPage() {
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 ring-1 ring-green-100 mb-4">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-bold text-green-800 tracking-wider uppercase">Built for Nigerian Households</span>
            </div>
            <h1 className="text-[40px] md:text-[64px] font-extrabold text-[#1a1a1a] tracking-tight leading-[1.1]">
              The Ultimate <span className="text-[var(--color-primary)]">Nigerian Meal Planner</span>
            </h1>
            <p className="text-[18px] md:text-[22px] font-medium text-[#4a4a4a] max-w-2xl mx-auto leading-relaxed">
              Struggling with what to cook today? Generate automated, budget-friendly Nigerian meal plans tailored to the ingredients you already have at home.
            </p>
            <div className="pt-6">
              <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-[var(--color-primary)] text-white text-[16px] font-extrabold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                Generate Your First Meal Plan
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 px-6 max-w-4xl mx-auto">
          <article className="prose prose-lg prose-slate max-w-none text-[17px] leading-[1.8] text-[#4a4a4a]">
            <h2 className="text-[28px] font-bold text-[#1a1a1a] mb-6">Why You Need a Dedicated Nigerian Meal Planner</h2>
            <p className="mb-6">
              If you live in Nigeria, you know the daily struggle of deciding what to eat. The question <em>"What are we eating today?"</em> is a constant source of stress in many households. Between managing the rising cost of food in the market, balancing work schedules, and trying to avoid food waste, planning meals manually is overwhelming. That is where a dedicated <strong>Nigerian meal planner</strong> becomes an essential tool for your household.
            </p>
            
            <p className="mb-6">
              Unlike generic international meal planning apps that suggest ingredients you can't easily find in local markets, a localized meal planner understands the nuances of the Nigerian kitchen. From staple foods like garri, rice, and yam to essential soups like egusi, ogbono, and edikaikong, the right system ensures your meals are realistic, culturally relevant, and budget-aware.
            </p>

            <h3 className="text-[24px] font-bold text-[#1a1a1a] mt-10 mb-4">The Impact of AI on Meal Planning in Nigeria</h3>
            <p className="mb-6">
              Artificial Intelligence is changing how we manage our kitchens. With an <Link href="/" className="text-[var(--color-primary)] font-semibold no-underline hover:underline">AI meal planner Nigeria</Link> households can instantly generate a full 7-day schedule. Instead of spending hours writing lists and trying to calculate costs, you can simply input your weekly budget and the ingredients you currently have in your pantry.
            </p>
            
            <p className="mb-6">
              For example, if you have half a bag of rice, some palm oil, and a tight budget of ₦15,000 for the week, the PlateUp AI engine will factor in these constraints. It will suggest affordable complementary ingredients and generate a comprehensive <strong>weekly meal planner Nigeria</strong> schedule that prevents you from overspending at the market.
            </p>

            <h3 className="text-[24px] font-bold text-[#1a1a1a] mt-10 mb-4">Core Benefits of Using PlateUp</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10 not-prose">
              <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/[0.03]">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="text-[18px] font-bold text-[#1a1a1a] mb-2">Reduce Food Waste</h4>
                <p className="text-[15px] text-[#4a4a4a]">Input leftover ingredients and let the AI find Nigerian recipes that utilize them perfectly before they spoil.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/[0.03]">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="text-[18px] font-bold text-[#1a1a1a] mb-2">Strict Budget Control</h4>
                <p className="text-[15px] text-[#4a4a4a]">As a <strong>budget meal planner Nigeria</strong> platform, we dynamically calculate portion costs to keep you under your limit.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/[0.03]">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="text-[18px] font-bold text-[#1a1a1a] mb-2">Automated Shopping Lists</h4>
                <p className="text-[15px] text-[#4a4a4a]">Never forget an ingredient at the market again. Your meal plan automatically generates a categorized shopping list.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/[0.03]">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="text-[18px] font-bold text-[#1a1a1a] mb-2">WhatsApp Integration</h4>
                <p className="text-[15px] text-[#4a4a4a]">Send your finalized market list directly to your WhatsApp for easy access while navigating busy local markets.</p>
              </div>
            </div>

            <h3 className="text-[24px] font-bold text-[#1a1a1a] mt-10 mb-4">How to Master Your Food Budget Planner</h3>
            <p className="mb-6">
              Using a <strong>food budget planner Nigeria</strong> is not just about eating cheap food; it is about eating smart. The key to successful meal planning is consistency. We recommend sitting down every Saturday to generate your meals for the upcoming week. Review what you already have in your freezer and pantry, input those into PlateUp, and let the AI do the heavy lifting.
            </p>
            <p className="mb-6">
              When you generate a plan, you will receive recommendations for Breakfast, Lunch, and Dinner. If a particular meal requires expensive proteins that don't fit your current financial situation, PlateUp's dynamic cost estimation engine will automatically substitute them for more affordable alternatives like eggs, fish, or plant-based proteins, ensuring you maintain a balanced diet without breaking the bank.
            </p>
            <p className="mb-6">
              Ready to take control of your kitchen? Join thousands of Nigerian households who have already abandoned the daily stress of deciding what to cook.
            </p>
          </article>
        </section>

        {/* CTA Banner */}
        <section className="py-16 px-6 max-w-4xl mx-auto">
          <div className="bg-[var(--color-primary)] rounded-[32px] p-10 md:p-14 text-center shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white opacity-10 rounded-full blur-[60px] transform translate-x-1/2 -translate-y-1/2"></div>
            <h2 className="text-[32px] font-extrabold text-white mb-4 relative z-10">Stop guessing what to cook.</h2>
            <p className="text-[18px] text-white/90 mb-8 max-w-lg mx-auto relative z-10">Generate your first budget-aware Nigerian meal plan for free.</p>
            <Link href="/auth/register" className="inline-flex items-center justify-center h-14 px-8 rounded-xl bg-white text-[var(--color-primary)] text-[16px] font-bold shadow-sm hover:shadow-md transition-all relative z-10">
              Create Free Account
            </Link>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 px-6 max-w-3xl mx-auto border-t border-black/[0.05]">
          <h2 className="text-[32px] font-extrabold text-[#1a1a1a] text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/[0.03]">
              <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-2">Does the Nigerian meal planner include local soups?</h3>
              <p className="text-[15px] text-[#4a4a4a] leading-relaxed">Yes! PlateUp is designed specifically for Nigerian cuisine and includes a vast array of local soups, swallows, and rice dishes.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/[0.03]">
              <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-2">Can I plan meals for my entire family?</h3>
              <p className="text-[15px] text-[#4a4a4a] leading-relaxed">Absolutely. During onboarding, you can specify your household size, and the AI will scale the shopping list and recommendations to fit your family.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/[0.03]">
              <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-2">Is the platform free to use?</h3>
              <p className="text-[15px] text-[#4a4a4a] leading-relaxed">Yes, the core AI meal generation features are completely free to use for all registered accounts.</p>
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

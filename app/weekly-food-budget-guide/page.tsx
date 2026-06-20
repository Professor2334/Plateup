/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import type { Metadata } from 'next';
import { PlateUpLogo } from '@/components/shared/PlateUpLogo';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Weekly Food Budget Guide | Master Your Nigerian Kitchen',
  description: 'The definitive weekly food budget guide for Nigeria. Learn how to allocate funds, manage market lists, and use AI to prevent grocery overspending.',
  alternates: { canonical: '/weekly-food-budget-guide' },
  openGraph: {
    title: 'Weekly Food Budget Guide | Master Your Nigerian Kitchen',
    description: 'The definitive weekly food budget guide for Nigeria. Learn how to allocate funds, manage market lists, and use AI to prevent grocery overspending.',
    url: 'https://plateup.com.ng/weekly-food-budget-guide',
  },
};

export default function WeeklyFoodBudgetGuidePage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-container-lowest)] flex flex-col font-sans">
      
      {/* Header */}
      <header className="h-20 bg-[var(--color-surface)] flex items-center px-6 sticky top-0 z-50 ring-1 ring-black/[0.02]">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <PlateUpLogo size="sm" href="/" />
          <div className="hidden md:flex gap-6">
            <Link href="/budget-meal-planner-nigeria" className="text-[14px] font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)]">Budget Planner</Link>
            <Link href="/how-to-plan-meals-on-a-budget" className="text-[14px] font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)]">How To Plan Meals</Link>
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 ring-1 ring-orange-100 mb-4">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              <span className="text-xs font-bold text-orange-800 tracking-wider uppercase">Financial Control</span>
            </div>
            <h1 className="text-[40px] md:text-[64px] font-extrabold text-[#1a1a1a] tracking-tight leading-[1.1]">
              The Nigerian <span className="text-[var(--color-primary)]">Weekly Food Budget Guide</span>
            </h1>
            <p className="text-[18px] md:text-[22px] font-medium text-[#4a4a4a] max-w-2xl mx-auto leading-relaxed">
              Stop wondering where your salary went. Learn how to structure your grocery spending and use AI to strictly enforce your financial boundaries.
            </p>
            <div className="pt-6">
              <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-[var(--color-primary)] text-white text-[16px] font-extrabold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                Try the AI Budget Planner
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 px-6 max-w-4xl mx-auto">
          <article className="prose prose-lg prose-slate max-w-none text-[17px] leading-[1.8] text-[#4a4a4a]">
            <h2 className="text-[28px] font-bold text-[#1a1a1a] mb-6">Why You Need a Weekly Food Budget Guide</h2>
            <p className="mb-6">
              In a rapidly changing economic environment, the cost of food is often the most volatile part of a household's expenses. Without a structured <strong>weekly food budget guide</strong>, it is incredibly easy to spend a large portion of your income on groceries that spoil or on expensive take-out because there was no plan in place.
            </p>
            
            <p className="mb-6">
              A food budget gives you permission to spend without guilt. It ensures that when you go to the market, you are buying exactly what your family needs to survive the week, leaving enough money for savings, rent, and emergencies.
            </p>

            <h3 className="text-[24px] font-bold text-[#1a1a1a] mt-10 mb-4">Step 1: Calculate Your True Food Expenditure</h3>
            <p className="mb-6">
              Before you can plan, you must track. Look at your bank statements from the last 30 days. Add up every single food-related purchase: market runs, supermarket visits, snacks bought in traffic, and food delivery apps. Most people are shocked to find out that their actual food expenditure is 30% to 50% higher than their estimated budget.
            </p>

            <h3 className="text-[24px] font-bold text-[#1a1a1a] mt-10 mb-4">Step 2: Utilize a Dedicated Budget Meal Planner Nigeria</h3>
            <p className="mb-6">
              Once you know your monthly limit, divide it by four to get your weekly budget. Now, the challenge is sticking to it. This is where PlateUp comes in. As the leading <strong>budget meal planner Nigeria</strong> platform, PlateUp acts as a strict financial enforcer for your kitchen.
            </p>
            <p className="mb-6">
              If your calculated weekly limit is ₦20,000, you simply input this figure into the PlateUp app along with your household size. The AI engine instantly calculates the maximum allowable cost per meal.
            </p>

            <h3 className="text-[24px] font-bold text-[#1a1a1a] mt-10 mb-4">Step 3: The 3-Tier Budget Allocation Rule</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">
              <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/[0.03]">
                <div className="text-[24px] font-bold text-[var(--color-primary)] mb-4">50% Staples</div>
                <p className="text-[15px] text-[#4a4a4a]">Half of your budget should go toward non-perishable carbohydrates and oils (Rice, Beans, Garri, Pasta, Palm Oil). These provide the bulk of your calories.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/[0.03]">
                <div className="text-[24px] font-bold text-[var(--color-primary)] mb-4">30% Proteins</div>
                <p className="text-[15px] text-[#4a4a4a]">Allocate thirty percent to proteins. Alternate between cheaper proteins (eggs, dried fish, beans) and expensive proteins (beef, chicken) to maintain this ratio.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/[0.03]">
                <div className="text-[24px] font-bold text-[var(--color-primary)] mb-4">20% Fresh Produce</div>
                <p className="text-[15px] text-[#4a4a4a]">The final twenty percent covers fresh vegetables, tomatoes, peppers, and fruits. Buy these weekly to prevent spoilage and waste.</p>
              </div>
            </div>

            <h3 className="text-[24px] font-bold text-[#1a1a1a] mt-10 mb-4">Step 4: Generate Your AI Meal Planner Nigeria Schedule</h3>
            <p className="mb-6">
              Armed with your budget and allocation, use an <strong>AI meal planner Nigeria</strong> like PlateUp. The system understands the 3-Tier rule automatically. When generating your 7-day plan, it ensures the resulting shopping list respects these boundaries. If you request a meal plan and the AI notices your budget is too low for chicken stew, it will intelligently substitute it with fish stew or egg sauce.
            </p>
            
            <p className="mb-6">
              This automated enforcement is what separates a simple recipe list from a true <strong>food budget planner Nigeria</strong>. You do not need to mentally calculate the cost of a cup of rice versus a tuber of yam; the algorithm handles the economics of the Nigerian market for you.
            </p>
          </article>
        </section>

        {/* CTA Banner */}
        <section className="py-16 px-6 max-w-4xl mx-auto">
          <div className="bg-[var(--color-primary)] rounded-[32px] p-10 md:p-14 text-center shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white opacity-10 rounded-full blur-[60px] transform translate-x-1/2 -translate-y-1/2"></div>
            <h2 className="text-[32px] font-extrabold text-white mb-4 relative z-10">Take control of your grocery expenses.</h2>
            <p className="text-[18px] text-white/90 mb-8 max-w-lg mx-auto relative z-10">Stop overspending. Start using our AI budget enforcement today.</p>
            <Link href="/auth/register" className="inline-flex items-center justify-center h-14 px-8 rounded-xl bg-white text-[var(--color-primary)] text-[16px] font-bold shadow-sm hover:shadow-md transition-all relative z-10">
              Create Your Budget Plan
            </Link>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 px-6 max-w-3xl mx-auto border-t border-black/[0.05]">
          <h2 className="text-[32px] font-extrabold text-[#1a1a1a] text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/[0.03]">
              <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-2">How accurate is the PlateUp budget calculation?</h3>
              <p className="text-[15px] text-[#4a4a4a] leading-relaxed">The AI uses advanced cost-per-portion constraints. While market prices fluctuate across different states in Nigeria, the AI maintains a strict ratio, ensuring you are directed towards affordable ingredient classes based on your total input.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/[0.03]">
              <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-2">Should I buy in bulk or weekly?</h3>
              <p className="text-[15px] text-[#4a4a4a] leading-relaxed">Buy staples (rice, beans, oils) in bulk monthly if you can afford it. Use your weekly budget strictly for perishables (vegetables, meat) and to fill small gaps. Input your bulk items into PlateUp to plan around them.</p>
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

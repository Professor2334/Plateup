/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import type { Metadata } from 'next';
import { PlateUpLogo } from '@/components/shared/PlateUpLogo';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Meal Planning for Students in Nigeria | Affordable Campus Food',
  description: 'Learn how to survive on campus with a tight budget. Use our AI meal planner to generate cheap, quick, and nutritious Nigerian meals for students.',
  alternates: { canonical: '/meal-planning-for-students' },
  openGraph: {
    title: 'Meal Planning for Students in Nigeria | Affordable Campus Food',
    description: 'Learn how to survive on campus with a tight budget. Use our AI meal planner to generate cheap, quick, and nutritious Nigerian meals for students.',
    url: 'https://plateup.com.ng/meal-planning-for-students',
  },
};

export default function MealPlanningForStudentsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-container-lowest)] flex flex-col font-sans">
      
      {/* Header */}
      <header className="h-20 bg-[var(--color-surface)] flex items-center px-6 sticky top-0 z-50 ring-1 ring-black/[0.02]">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <PlateUpLogo size="sm" href="/" />
          <div className="hidden md:flex gap-6">
            <Link href="/nigerian-meal-planner" className="text-[14px] font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)]">AI Planner</Link>
            <Link href="/budget-meal-planner-nigeria" className="text-[14px] font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)]">Budget Planner</Link>
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 ring-1 ring-blue-100 mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-xs font-bold text-blue-800 tracking-wider uppercase">Built for Campus Life</span>
            </div>
            <h1 className="text-[40px] md:text-[64px] font-extrabold text-[#1a1a1a] tracking-tight leading-[1.1]">
              Meal Planning for <span className="text-[var(--color-primary)]">Students in Nigeria</span>
            </h1>
            <p className="text-[18px] md:text-[22px] font-medium text-[#4a4a4a] max-w-2xl mx-auto leading-relaxed">
              Survive campus life on a tight budget. Let our AI generate cheap, fast, and nutritious Nigerian meals so you can focus on your studies.
            </p>
            <div className="pt-6">
              <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-[var(--color-primary)] text-white text-[16px] font-extrabold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                Plan Your Campus Meals
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 px-6 max-w-4xl mx-auto">
          <article className="prose prose-lg prose-slate max-w-none text-[17px] leading-[1.8] text-[#4a4a4a]">
            <h2 className="text-[28px] font-bold text-[#1a1a1a] mb-6">The Student Survival Guide to Campus Feeding</h2>
            <p className="mb-6">
              Being a student in a Nigerian university comes with its unique set of challenges, and managing your feeding allowance is usually at the top of the list. Between buying textbooks, paying for transportation, and handling unpredictable expenses, your weekly food budget takes a massive hit. 
            </p>
            
            <p className="mb-6">
              Many students resort to eating noodles every day or skipping meals entirely because they ran out of money before the month ended. But it doesn't have to be this way. With proper <strong>meal planning for students</strong>, you can eat a balanced diet on campus without calling home for urgent funds.
            </p>

            <h3 className="text-[24px] font-bold text-[#1a1a1a] mt-10 mb-4">Why Students Need PlateUp</h3>
            <p className="mb-6">
              PlateUp is the perfect <strong>Nigerian meal planner</strong> for students because it is highly budget-aware. When your allowance is running low, you can input a strict budget into the app. The AI understands that you cannot afford expensive meats or complicated dishes that require hours of preparation.
            </p>
            
            <p className="mb-6">
              Instead, it will suggest practical, filling student-friendly meals like Concoction Rice, Beans and Garri, Yam Porridge, and affordable egg-based dishes. More importantly, it factors in the ingredients you already have in your hostel corner—like that half-empty bottle of palm oil or the remaining cups of rice.
            </p>

            <h3 className="text-[24px] font-bold text-[#1a1a1a] mt-10 mb-4">Rules for Eating Well on a Campus Budget</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10 not-prose">
              <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/[0.03]">
                <div className="text-[24px] font-bold text-[var(--color-primary)] mb-4">Cook in Bulk</div>
                <p className="text-[15px] text-[#4a4a4a]">Cooking small meals daily is expensive. Use your meal plan to cook stews and soups in bulk on weekends and store them if you have access to a freezer or regular electricity.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/[0.03]">
                <div className="text-[24px] font-bold text-[var(--color-primary)] mb-4">Stop Buying Food Outside</div>
                <p className="text-[15px] text-[#4a4a4a]">Buying from campus vendors depletes your budget rapidly. A well-structured meal plan ensures you always have something to eat in your hostel.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/[0.03]">
                <div className="text-[24px] font-bold text-[var(--color-primary)] mb-4">Embrace Cheap Proteins</div>
                <p className="text-[15px] text-[#4a4a4a]">Beef is a luxury. Embrace eggs, soya beans, crayfish, and affordable fish varieties. The AI will naturally bias towards these when your budget is tight.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/[0.03]">
                <div className="text-[24px] font-bold text-[var(--color-primary)] mb-4">Track Your Inventory</div>
                <p className="text-[15px] text-[#4a4a4a]">Keep an eye on your dry goods (rice, beans, garri, pasta). Input them into PlateUp before generating your shopping list to avoid buying what you already have.</p>
              </div>
            </div>

            <h3 className="text-[24px] font-bold text-[#1a1a1a] mt-10 mb-4">Using an AI Meal Planner in Nigeria</h3>
            <p className="mb-6">
              When using an <strong>AI meal planner Nigeria</strong> tool like PlateUp, your goal is to reduce cognitive load. You already have assignments, tests, and classes to worry about. You shouldn't have to spend mental energy figuring out what to cook. By planning your entire week on Sunday evening, you can buy all your groceries at once and stick strictly to the plan.
            </p>
            <p className="mb-6">
              The AI will also generate a WhatsApp-friendly shopping list. This means you can quickly buy exactly what you need at the campus market or local stalls without getting distracted by snacks and impulse purchases.
            </p>
          </article>
        </section>

        {/* CTA Banner */}
        <section className="py-16 px-6 max-w-4xl mx-auto">
          <div className="bg-[var(--color-primary)] rounded-[32px] p-10 md:p-14 text-center shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white opacity-10 rounded-full blur-[60px] transform translate-x-1/2 -translate-y-1/2"></div>
            <h2 className="text-[32px] font-extrabold text-white mb-4 relative z-10">Don't run out of money mid-semester.</h2>
            <p className="text-[18px] text-white/90 mb-8 max-w-lg mx-auto relative z-10">Use PlateUp to secure your food allowance and eat well all month long.</p>
            <Link href="/auth/register" className="inline-flex items-center justify-center h-14 px-8 rounded-xl bg-white text-[var(--color-primary)] text-[16px] font-bold shadow-sm hover:shadow-md transition-all relative z-10">
              Generate Free Meal Plan
            </Link>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 px-6 max-w-3xl mx-auto border-t border-black/[0.05]">
          <h2 className="text-[32px] font-extrabold text-[#1a1a1a] text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/[0.03]">
              <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-2">Can PlateUp generate meals that are fast to cook?</h3>
              <p className="text-[15px] text-[#4a4a4a] leading-relaxed">Yes. PlateUp prioritizes standard, easy-to-cook Nigerian meals that do not require complex kitchen equipment, which is perfect for students using hotplates or camp gas.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/[0.03]">
              <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-2">What if I only have ₦5,000 for the week?</h3>
              <p className="text-[15px] text-[#4a4a4a] leading-relaxed">Just input your ₦5,000 budget. The AI will strictly suggest recipes based on highly affordable staples like beans, garri, and cheap vegetables to ensure you don't exceed your limit.</p>
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

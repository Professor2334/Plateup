"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlateUpLogo } from "@/components/shared/PlateUpLogo";
import { Menu, X, ArrowRight, CheckCircle2, XCircle, ChevronDown, Check, Zap, Sparkles, Receipt, ListTodo, History, MessageCircle } from "lucide-react";

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [demoStep, setDemoStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { label: "Home", id: "home" },
    { label: "How It Works", id: "how-it-works" },
    { label: "Features", id: "features" },
    { label: "FAQ", id: "faq" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] font-sans text-[var(--color-on-background)] selection:bg-[var(--color-primary)] selection:text-white pb-20 overflow-x-hidden">
      {/* ── TOP NAVIGATION ── */}
      <div className="fixed top-0 w-full z-50 transition-all duration-300 pointer-events-none px-4 md:px-6">
        <header className={`mx-auto max-w-[1440px] pointer-events-auto transition-all duration-500 rounded-2xl ${isScrolled ? "mt-4 bg-[var(--color-surface)]/75 backdrop-blur-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] py-3 px-11" : "mt-6 bg-transparent py-4 px-7"}`}>
          <div className="flex items-center justify-between">
            {/* LEFT: Logo */}
            <div className="flex-1 flex justify-start">
              <PlateUpLogo size="sm" href="/" />
            </div>
            
            {/* CENTER: Desktop Nav */}
            <nav className="hidden md:flex flex-none items-center justify-center gap-8">
              {navLinks.map((link) => (
                <button key={link.id} onClick={() => scrollToSection(link.id)} className="text-[13px] font-semibold text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
                  {link.label}
                </button>
              ))}
            </nav>
            
            {/* RIGHT: CTA & Mobile Toggle */}
            <div className="flex-1 flex justify-end items-center">
              <div className="hidden md:block">
                <Link href="/auth/register" className="inline-flex items-center justify-center h-9 px-5 rounded-lg bg-[var(--color-primary)] text-white text-[13px] font-bold hover:opacity-90 transition-opacity shadow-sm">
                  Get Started
                </Link>
              </div>
              <button className="md:hidden text-[var(--color-on-surface)]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-[var(--color-surface)] rounded-2xl shadow-lg p-5 flex flex-col gap-3 md:hidden mt-2 border border-[var(--color-outline-variant)]">
              {navLinks.map((link) => (
                <button key={link.id} onClick={() => scrollToSection(link.id)} className="text-left text-[14px] font-semibold text-[var(--color-on-surface)] py-2 border-b border-[var(--color-outline-variant)]/30">
                  {link.label}
                </button>
              ))}
              <Link href="/auth/register" className="mt-3 flex items-center justify-center h-10 rounded-lg bg-[var(--color-primary)] text-white font-bold text-[14px] shadow-sm">
                Get Started
              </Link>
            </div>
          )}
        </header>
      </div>

      <main>
        {/* ── SECTION 1: HERO ── */}
        <section id="home" className="pt-32 lg:pt-40 pb-24 px-6 max-w-5xl mx-auto flex flex-col items-center text-center">
          <div className="flex flex-col items-center w-full">
            <div className="relative group mb-8 md:mb-10">
              <div className="absolute inset-0 bg-[var(--color-primary)] opacity-20 blur-xl rounded-full scale-110"></div>
              <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary)]/10 text-[13px] font-semibold text-[var(--color-primary)] shadow-sm animate-[float-subtle_4s_ease-in-out_infinite]">
                <span className="text-[14px]">🇳🇬</span> Built for Nigerian Households
              </div>
            </div>
            
            <h1 className="text-[36px] sm:text-[44px] lg:text-[52px] font-extrabold leading-[1.15] tracking-tight text-[var(--color-on-surface)] max-w-[850px] mb-[25px]">
              Plan Your Week's Meals in <span className="text-[var(--color-primary)]">Under 60 Seconds</span>
            </h1>
            
            <p className="text-[16px] md:text-[18px] text-[var(--color-on-surface-variant)] opacity-85 leading-relaxed max-w-[600px] mb-10 md:mb-12">
              Tell PlateUp your budget and available ingredients. Get a complete 7-day Nigerian meal plan and shopping list instantly.
            </p>
            
            <div className="w-full sm:w-auto flex flex-col items-center">
              <Link href="/auth/register" className="inline-flex items-center justify-center h-14 px-10 rounded-xl bg-[var(--color-primary)] text-white text-[16px] font-bold hover:opacity-90 transition-opacity shadow-[0_8px_20px_rgb(0,0,0,0.12)] w-full sm:w-auto">
                Generate My First Meal Plan
              </Link>
              
              {/* Social Proof Row */}
              <div className="mt-8 flex flex-wrap justify-center gap-5 text-[13px] font-semibold text-[var(--color-on-surface-variant)]">
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-[var(--color-primary)]" strokeWidth={3} /> Nigerian Meals</span>
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-[var(--color-primary)]" strokeWidth={3} /> Budget Planning</span>
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-[var(--color-primary)]" strokeWidth={3} /> Smart Shopping Lists</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: TRUST BAR ── */}
        <section className="bg-[var(--color-surface-container-lowest)] py-10 overflow-hidden relative">
          {/* Gradient Masks for smooth fade at edges */}
          <div className="absolute top-0 bottom-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[var(--color-surface-container-lowest)] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[var(--color-surface-container-lowest)] to-transparent z-10 pointer-events-none"></div>
          
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {[...Array(2)].map((_, arrayIndex) => (
              <div key={arrayIndex} className="flex items-center gap-6 md:gap-10 px-3 md:px-5">
                {[
                  { label: "7-Day Meal Plans", icon: Sparkles },
                  { label: "Budget-Aware Planning", icon: Zap },
                  { label: "Smart Shopping Lists", icon: Receipt },
                  { label: "Meal History", icon: History },
                  { label: "WhatsApp Sharing", icon: MessageCircle }
                ].map((metric, i) => {
                  const Icon = metric.icon;
                  return (
                    <div key={`${arrayIndex}-${i}`} className="flex items-center gap-3 px-6 py-3.5 rounded-full bg-[var(--color-surface)] text-[var(--color-on-surface)] font-semibold text-[15px] shadow-[0_4px_24px_rgb(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 cursor-default whitespace-nowrap">
                      <div className="bg-[var(--color-primary)]/10 p-1.5 rounded-full"><Icon className="w-5 h-5 text-[var(--color-primary)]" /></div>
                      {metric.label}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: HOW IT WORKS ── */}
        <section id="how-it-works" className="py-20 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-[28px] md:text-[32px] font-extrabold text-[var(--color-on-surface)] tracking-tight">How PlateUp works</h2>
            <p className="text-[15px] text-[var(--color-on-surface-variant)] font-medium">Three simple steps to a week of stress-free eating.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[36px] left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-transparent via-[var(--color-outline-variant)] to-transparent -z-10"></div>
            
            {[
              { step: 1, title: "Set Your Budget", desc: "Choose a weekly food budget." },
              { step: 2, title: "Add Ingredients", desc: "Tell PlateUp what you already have." },
              { step: 3, title: "Get Your Meal Plan", desc: "Receive a complete Nigerian meal plan and shopping list." }
            ].map((item) => (
              <div key={item.step} className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-outline-variant)] shadow-sm flex flex-col items-center text-center space-y-3 relative z-10 hover:-translate-y-1 transition-transform duration-300">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-extrabold text-[15px] shadow-sm">
                  {item.step}
                </div>
                <h3 className="text-[16px] font-bold text-[var(--color-on-surface)]">{item.title}</h3>
                <p className="text-[13px] font-medium text-[var(--color-on-surface-variant)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 4: INTERACTIVE DEMO ── */}
        <section className="py-20 px-6 bg-[var(--color-surface-container-low)] border-y border-[var(--color-outline-variant)]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <h2 className="text-[28px] md:text-[32px] font-extrabold text-[var(--color-on-surface)] tracking-tight leading-tight">Watch the AI in action</h2>
              <p className="text-[15px] text-[var(--color-on-surface-variant)] font-medium leading-relaxed">
                Input your constraints and let our engine instantly build a practical menu that fits your life.
              </p>
              
              <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-outline-variant)] shadow-sm space-y-5 mt-6">
                <div>
                  <label className="text-[11px] uppercase font-bold text-[var(--color-on-surface-variant)] tracking-wider">Weekly Budget</label>
                  <div className="mt-1.5 text-[24px] font-extrabold text-[var(--color-primary)]">₦20,000</div>
                </div>
                <div>
                  <label className="text-[11px] uppercase font-bold text-[var(--color-on-surface-variant)] tracking-wider">Available Ingredients</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["Rice", "Beans", "Eggs", "Tomatoes"].map((ing) => (
                      <span key={ing} className="px-2.5 py-1 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-md text-[12px] font-bold text-[var(--color-on-surface)]">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="w-full h-11 bg-[var(--color-primary)] rounded-lg flex items-center justify-center text-white font-bold text-[13px] shadow-sm">
                  <Sparkles className="w-4 h-4 mr-2" /> Generating Plan...
                </div>
              </div>
            </div>

            {/* Animated Result */}
            <div className="relative">
              <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-outline-variant)] shadow-md">
                <div className="flex items-center justify-between border-b border-[var(--color-outline-variant)] pb-3 mb-4">
                  <h3 className="text-[15px] font-bold text-[var(--color-on-surface)]">Generated Example</h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-green-100 text-green-800 rounded">Within Budget</span>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1.5 transition-opacity duration-500">
                    <div className="text-[13px] font-bold text-[var(--color-primary)]">Monday</div>
                    <div className="flex flex-col sm:flex-row gap-2 text-[12px] text-[var(--color-on-surface-variant)]">
                      <div className="flex-1 bg-[var(--color-surface-container-low)] p-2 rounded-lg border border-[var(--color-outline-variant)]"><span className="font-bold block text-[10px] uppercase mb-0.5">Breakfast</span>Akara & Pap</div>
                      <div className="flex-1 bg-[var(--color-surface-container-low)] p-2 rounded-lg border border-[var(--color-outline-variant)]"><span className="font-bold block text-[10px] uppercase mb-0.5">Lunch</span>Jollof Rice</div>
                      <div className="flex-1 bg-[var(--color-surface-container-low)] p-2 rounded-lg border border-[var(--color-outline-variant)]"><span className="font-bold block text-[10px] uppercase mb-0.5">Dinner</span>Egusi Soup</div>
                    </div>
                  </div>
                  <div className={`space-y-1.5 transition-opacity duration-500 ${demoStep >= 1 ? 'opacity-100' : 'opacity-20'}`}>
                    <div className="text-[13px] font-bold text-[var(--color-primary)]">Tuesday</div>
                    <div className="flex flex-col sm:flex-row gap-2 text-[12px] text-[var(--color-on-surface-variant)]">
                      <div className="flex-1 bg-[var(--color-surface-container-low)] p-2 rounded-lg border border-[var(--color-outline-variant)]"><span className="font-bold block text-[10px] uppercase mb-0.5">Breakfast</span>Bread & Egg</div>
                      <div className="flex-1 bg-[var(--color-surface-container-low)] p-2 rounded-lg border border-[var(--color-outline-variant)]"><span className="font-bold block text-[10px] uppercase mb-0.5">Lunch</span>Leftover Jollof</div>
                      <div className="flex-1 bg-[var(--color-surface-container-low)] p-2 rounded-lg border border-[var(--color-outline-variant)]"><span className="font-bold block text-[10px] uppercase mb-0.5">Dinner</span>Yam & Sauce</div>
                    </div>
                  </div>
                  <div className={`space-y-1.5 transition-opacity duration-500 ${demoStep >= 2 ? 'opacity-100' : 'opacity-10'}`}>
                    <div className="text-[13px] font-bold text-[var(--color-primary)]">Wednesday</div>
                    <div className="flex flex-col sm:flex-row gap-2 text-[12px] text-[var(--color-on-surface-variant)]">
                      <div className="flex-1 bg-[var(--color-surface-container-low)] p-2 rounded-lg border border-[var(--color-outline-variant)]"><span className="font-bold block text-[10px] uppercase mb-0.5">Breakfast</span>Oats & Milk</div>
                      <div className="flex-1 bg-[var(--color-surface-container-low)] p-2 rounded-lg border border-[var(--color-outline-variant)]"><span className="font-bold block text-[10px] uppercase mb-0.5">Lunch</span>Beans & Plantain</div>
                      <div className="flex-1 bg-[var(--color-surface-container-low)] p-2 rounded-lg border border-[var(--color-outline-variant)]"><span className="font-bold block text-[10px] uppercase mb-0.5">Dinner</span>Okra Soup</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: BENTO FEATURE GRID ── */}
        <section id="features" className="py-20 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-[28px] md:text-[32px] font-extrabold text-[var(--color-on-surface)] tracking-tight">Everything your household needs</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[minmax(200px,auto)]">
            {/* Large Card */}
            <div className="md:col-span-2 md:row-span-2 bg-[var(--color-surface)] rounded-[24px] p-8 border border-[var(--color-outline-variant)] shadow-sm flex flex-col overflow-hidden relative group">
              <div className="z-10 relative">
                <div className="w-10 h-10 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg flex items-center justify-center mb-4"><Sparkles className="w-5 h-5"/></div>
                <h3 className="text-[22px] font-extrabold text-[var(--color-on-surface)] mb-2">AI Weekly Meal Plans</h3>
                <p className="text-[14px] font-medium text-[var(--color-on-surface-variant)] max-w-[280px] leading-relaxed">Intelligently generated 7-day menus focusing on Nigerian cuisine and your exact household requirements.</p>
              </div>
              {/* Fake UI Graphic */}
              <div className="absolute right-0 bottom-0 w-[60%] h-[60%] bg-[var(--color-surface-container-lowest)] rounded-tl-2xl border-t border-l border-[var(--color-outline-variant)] shadow-xl p-6 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-500">
                <div className="w-3/4 h-4 bg-[var(--color-surface-container-low)] rounded mb-4"></div>
                <div className="w-full h-10 bg-[var(--color-surface-container-low)] rounded-lg mb-3 border border-[var(--color-outline-variant)]"></div>
                <div className="w-full h-10 bg-[var(--color-surface-container-low)] rounded-lg border border-[var(--color-outline-variant)]"></div>
              </div>
            </div>

            {/* Medium Card 1 */}
            <div className="bg-[var(--color-surface)] rounded-[24px] p-6 border border-[var(--color-outline-variant)] shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg flex items-center justify-center mb-4"><Receipt className="w-5 h-5"/></div>
                <h3 className="text-[18px] font-extrabold text-[var(--color-on-surface)] mb-2">Smart Shopping Lists</h3>
                <p className="text-[13px] font-medium text-[var(--color-on-surface-variant)] leading-relaxed">Automatically extracted ingredients structured for easy market runs.</p>
              </div>
            </div>

            {/* Medium Card 2 */}
            <div className="bg-[var(--color-surface)] rounded-[24px] p-6 border border-[var(--color-outline-variant)] shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg flex items-center justify-center mb-4"><Zap className="w-5 h-5"/></div>
                <h3 className="text-[18px] font-extrabold text-[var(--color-on-surface)] mb-2">Budget Optimization</h3>
                <p className="text-[13px] font-medium text-[var(--color-on-surface-variant)] leading-relaxed">Algorithms prioritize affordable ingredients to stay within your limits.</p>
              </div>
            </div>

            {/* Small Cards Row */}
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-[var(--color-surface)] rounded-[20px] p-5 border border-[var(--color-outline-variant)] shadow-sm flex items-center gap-4 hover:bg-[var(--color-surface-container-low)] transition-colors">
                <div className="bg-[var(--color-primary)]/10 p-2.5 rounded-lg"><History className="w-5 h-5 text-[var(--color-primary)]" /></div>
                <span className="font-extrabold text-[15px] text-[var(--color-on-surface)]">Meal History</span>
              </div>
              <div className="bg-[var(--color-surface)] rounded-[20px] p-5 border border-[var(--color-outline-variant)] shadow-sm flex items-center gap-4 hover:bg-[var(--color-surface-container-low)] transition-colors">
                <div className="bg-[var(--color-primary)]/10 p-2.5 rounded-lg"><ListTodo className="w-5 h-5 text-[var(--color-primary)]" /></div>
                <span className="font-extrabold text-[15px] text-[var(--color-on-surface)]">Ingredient Reuse</span>
              </div>
              <div className="bg-[var(--color-surface)] rounded-[20px] p-5 border border-[var(--color-outline-variant)] shadow-sm flex items-center gap-4 hover:bg-[var(--color-surface-container-low)] transition-colors">
                <div className="bg-[var(--color-primary)]/10 p-2.5 rounded-lg"><MessageCircle className="w-5 h-5 text-[var(--color-primary)]" /></div>
                <span className="font-extrabold text-[15px] text-[var(--color-on-surface)]">WhatsApp Sharing</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 6: BEFORE VS AFTER ── */}
        <section className="py-20 px-6 bg-[var(--color-surface-container-low)] border-y border-[var(--color-outline-variant)]">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Without PlateUp */}
              <div className="bg-[var(--color-surface)] rounded-[24px] p-8 border border-[var(--color-outline-variant)] shadow-sm">
                <h3 className="text-[12px] font-extrabold uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-6 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-[var(--color-on-surface-variant)]" /> Without PlateUp
                </h3>
                <ul className="space-y-4">
                  {["Overspending at the market", "Repeating the same meals", "Wasting unused ingredients", "Last-minute cooking decisions"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[14px] font-medium text-[var(--color-on-surface)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-outline)]"></div> {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* With PlateUp */}
              <div className="bg-[var(--color-primary)] rounded-[24px] p-8 shadow-md text-white">
                <h3 className="text-[12px] font-extrabold uppercase tracking-widest text-white/80 mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-white" /> With PlateUp
                </h3>
                <ul className="space-y-4">
                  {["Weekly meal plan ready instantly", "Budget-aware recommendations", "Smart, organized shopping list", "Better ingredient utilization"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[14px] font-bold">
                      <Check className="w-4 h-4 text-green-300" strokeWidth={3} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 7: PRODUCT SHOWCASE ── */}
        <section className="py-24 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-[28px] md:text-[32px] font-extrabold text-[var(--color-on-surface)] tracking-tight">Built for clarity and focus</h2>
          </div>
          <div className="w-full bg-[var(--color-surface)] rounded-[24px] border border-[var(--color-outline-variant)] shadow-xl overflow-hidden">
            {/* Fake Dashboard Header */}
            <div className="h-12 border-b border-[var(--color-outline-variant)] flex items-center px-6 gap-6">
              <div className="font-extrabold text-[16px] text-[var(--color-primary)]">PlateUp</div>
              <div className="hidden md:flex gap-5 text-[13px] font-bold text-[var(--color-on-surface-variant)]">
                <span className="text-[var(--color-on-surface)] border-b-2 border-[var(--color-primary)] py-3.5">Generate Plan</span>
                <span className="py-3.5">Meal History</span>
                <span className="py-3.5">Saved Plans</span>
              </div>
            </div>
            {/* Dashboard Body */}
            <div className="p-6 md:p-10 bg-[var(--color-surface-container-lowest)] flex flex-col md:flex-row gap-8 lg:gap-12">
              <div className="w-full md:w-1/3 space-y-6">
                <div className="space-y-2">
                  <label className="text-[12px] font-extrabold">Weekly Budget (₦)</label>
                  <div className="h-11 border border-[var(--color-outline-variant)] bg-[var(--color-surface)] rounded-lg px-3 flex items-center font-bold text-[15px]">15,000</div>
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-extrabold">Available Ingredients</label>
                  <div className="min-h-[80px] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] rounded-lg p-3 font-bold text-[13px] text-[var(--color-on-surface-variant)]">Yam, Eggs, Spinach, Palm Oil</div>
                </div>
                <div className="h-11 bg-[var(--color-primary)] text-white font-bold text-[14px] rounded-lg flex items-center justify-center shadow-sm">Generate Meal Plan</div>
              </div>
              <div className="w-full md:w-2/3 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[20px] font-extrabold">Your Plan</h3>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[11px] font-extrabold rounded-md border border-amber-200">Approaching Budget</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-5 border border-[var(--color-outline-variant)] bg-[var(--color-surface)] rounded-xl space-y-3 shadow-sm">
                    <div className="font-extrabold text-[14px] border-b border-[var(--color-outline-variant)] pb-2 text-[var(--color-primary)]">Monday</div>
                    <div className="text-[13px] font-bold"><span className="text-[var(--color-on-surface-variant)] font-medium">Break:</span> Boiled Yam & Egg Sauce</div>
                    <div className="text-[13px] font-bold"><span className="text-[var(--color-on-surface-variant)] font-medium">Lunch:</span> Efo Riro</div>
                    <div className="text-[13px] font-bold"><span className="text-[var(--color-on-surface-variant)] font-medium">Dinner:</span> Yam Porridge</div>
                  </div>
                  <div className="p-5 border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] rounded-xl shadow-sm">
                    <div className="font-extrabold text-[14px] mb-3">Shopping List</div>
                    <ul className="space-y-2.5 text-[13px] font-medium">
                      <li className="flex items-center gap-2.5"><Check className="w-3.5 h-3.5 text-[var(--color-primary)]" strokeWidth={3}/> Tomatoes & Peppers</li>
                      <li className="flex items-center gap-2.5"><Check className="w-3.5 h-3.5 text-[var(--color-primary)]" strokeWidth={3}/> Onions</li>
                      <li className="flex items-center gap-2.5"><Check className="w-3.5 h-3.5 text-[var(--color-primary)]" strokeWidth={3}/> Crayfish</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 8: FAQ ── */}
        <section id="faq" className="py-20 px-6 max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[28px] md:text-[32px] font-extrabold text-[var(--color-on-surface)] tracking-tight">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {[
              { q: "Is PlateUp free?", a: "Yes, the MVP version of PlateUp is completely free to use." },
              { q: "Can I regenerate meal plans?", a: "Yes, if you don't like a generated plan, you can regenerate it instantly." },
              { q: "Does PlateUp use Nigerian meals?", a: "Absolutely. PlateUp's AI is specifically fine-tuned for Nigerian households, recipes, and local market ingredients." },
              { q: "Can I save meal plans?", a: "Yes, you can bookmark your favorite plans to reuse them anytime without regenerating." },
              { q: "Can I share meal plans?", a: "Yes, you can share your meal plan and shopping list directly to WhatsApp." }
            ].map((faq, i) => (
              <div key={i} className="border border-[var(--color-outline-variant)] rounded-xl bg-[var(--color-surface)] overflow-hidden transition-all duration-300 shadow-sm">
                <button 
                  className="w-full flex items-center justify-between p-5 text-left font-extrabold text-[15px]"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                >
                  {faq.q}
                  <ChevronDown className={`w-4 h-4 text-[var(--color-on-surface-variant)] transition-transform duration-300 ${activeFaq === i ? "rotate-180" : ""}`} />
                </button>
                <div className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === i ? "max-h-[200px] pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
                  <p className="text-[14px] font-medium text-[var(--color-on-surface-variant)] leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 9: FINAL CTA ── */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto bg-[var(--color-primary)] rounded-[32px] p-10 md:p-16 text-center shadow-xl relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10 space-y-6">
              <h2 className="text-[32px] md:text-[40px] font-extrabold text-white tracking-tight leading-tight">
                Ready To Stop Guessing What To Cook?
              </h2>
              <p className="text-[16px] font-medium text-white/90 max-w-xl mx-auto">
                Generate a personalized Nigerian meal plan in under a minute.
              </p>
              <div className="pt-4">
                <Link href="/auth/register" className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-white text-[var(--color-primary)] text-[15px] font-extrabold hover:scale-105 transition-transform duration-300 shadow-md">
                  Generate My First Meal Plan
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[var(--color-outline-variant)] py-10 px-6 text-center">
        <PlateUpLogo size="sm" href="/" className="justify-center mb-5" />
        <p className="text-[13px] font-medium text-[var(--color-on-surface-variant)]">
          © {new Date().getFullYear()} PlateUp. Built for Nigerian households.
        </p>
      </footer>
    </div>
  );
}

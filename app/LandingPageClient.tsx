/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { PlateUpLogo } from "@/components/shared/PlateUpLogo";
import { Menu, X, ArrowRight, CheckCircle2, XCircle, ChevronDown, Check, Zap, Sparkles, Receipt, ListTodo, History, MessageCircle, Wallet, Carrot, ShoppingBag, ChevronRight, Coffee, Utensils, Calendar, ShoppingCart, Loader2 } from "lucide-react";
import { PopularMealsMarquee } from "@/components/landing/PopularMealsMarquee";

const SHOWCASE_DAYS = [
  { day: "Monday", meals: { b: "Boiled Yam & Egg Sauce", l: "Efo Riro", d: "Yam Porridge" }, ingredients: "Yam, Eggs, Spinach, Palm Oil", shopping: ["Tomatoes & Peppers", "Onions", "Crayfish"] },
  { day: "Tuesday", meals: { b: "Akara & Pap", l: "Jollof Rice & Dodo", d: "Egusi Soup & Pounded Yam" }, ingredients: "Beans, Rice, Plantain, Melon Seeds", shopping: ["Beef", "Fresh Tomatoes", "Ugu Leaves"] },
  { day: "Wednesday", meals: { b: "Bread & Fried Eggs", l: "Fried Rice & Chicken", d: "Suya & Garri" }, ingredients: "Bread, Eggs, Rice, Chicken", shopping: ["Carrots & Peas", "Vegetable Oil", "Suya Spice"] },
  { day: "Thursday", meals: { b: "Moi Moi", l: "Ofada Rice", d: "Okra Soup & Fufu" }, ingredients: "Beans, Ofada Rice, Okra", shopping: ["Assorted Meat", "Locust Beans", "Scotch Bonnet"] },
  { day: "Friday", meals: { b: "Pancakes & Syrup", l: "Spaghetti & Meatballs", d: "Catfish Peppersoup" }, ingredients: "Flour, Spaghetti, Minced Beef", shopping: ["Catfish", "Peppersoup Spice", "Scent Leaves"] },
  { day: "Saturday", meals: { b: "Indomie & Egg", l: "Asaro", d: "Banga Soup & Starch" }, ingredients: "Noodles, Eggs, Yam, Palm Nut Extract", shopping: ["Smoked Fish", "Crayfish", "Sausages"] },
  { day: "Sunday", meals: { b: "Custard & Beans", l: "Sunday Rice & Stew", d: "Shawarma" }, ingredients: "Beans, Rice, Chicken, Cabbage", shopping: ["Fresh Tomatoes", "Mayonnaise", "Tortilla Wraps"] }
];

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [demoStep, setDemoStep] = useState(0);

  // Showcase animation state
  const showcaseRef = useRef<HTMLDivElement>(null);
  const [isShowcaseInView, setIsShowcaseInView] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsShowcaseInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (showcaseRef.current) observer.observe(showcaseRef.current);
    return () => observer.disconnect();
  }, []);

  const [showcaseState, setShowcaseState] = useState<'idle' | 'generating' | 'generated'>('idle');

  const [showcaseDayIndex, setShowcaseDayIndex] = useState(0);

  useEffect(() => {
    if (isShowcaseInView && showcaseState === 'idle') {
      setShowcaseState('generating');
    } else if (!isShowcaseInView && showcaseState !== 'idle') {
      setShowcaseState('idle');
      setShowcaseDayIndex((prev) => (prev + 1) % SHOWCASE_DAYS.length);
    }
  }, [isShowcaseInView, showcaseState]);

  useEffect(() => {
    if (showcaseState === 'generating') {
      const timer = setTimeout(() => {
        setShowcaseState('generated');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showcaseState]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % 16);
    }, 1000);
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
    <div className="min-h-screen bg-[var(--color-background)] font-sans text-[var(--color-on-background)] selection:bg-[var(--color-primary)] selection:text-white pb-20">
      {/* ── TOP NAVIGATION ── */}
      <div className="sticky top-0 w-full z-[1000] transition-all duration-300 pointer-events-none px-4 md:px-6 pt-4 pb-2 md:pt-6 md:pb-4">
        <header className="mx-auto max-w-[1440px] pointer-events-auto rounded-2xl bg-white/85 backdrop-blur-xl border border-[var(--color-outline-variant)]/20 shadow-[0_8px_30px_rgba(0,0,0,0.08)] py-3 px-4 md:px-7 lg:px-11 transition-all duration-300">
          <div className="flex items-center justify-between">
            {/* LEFT: Logo */}
            <div className="flex-1 flex justify-start">
              <PlateUpLogo size="sm" href="/" />
            </div>
            
            {/* CENTER: Desktop Nav */}
            <nav className="hidden md:flex flex-none items-center justify-center gap-8">
              {navLinks.map((link) => (
                <button key={link.id} onClick={() => scrollToSection(link.id)} className="text-[0.8125rem] font-semibold text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
                  {link.label}
                </button>
              ))}
            </nav>
            
            {/* RIGHT: CTA & Mobile Toggle */}
            <div className="flex-1 flex justify-end items-center">
              <div className="hidden md:block">
                <Link href="/auth/register" prefetch={true} className="inline-flex items-center justify-center h-9 px-5 rounded-lg bg-[var(--color-primary)] text-white text-[0.8125rem] font-bold hover:opacity-90 transition-opacity shadow-sm">
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
            <div className="absolute top-full left-0 right-0 mx-4 mt-2 bg-white/95 backdrop-blur-lg rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-6 flex flex-col gap-2 md:hidden border border-white/40 animate-in fade-in slide-in-from-top-4 duration-300 ease-out">
              {navLinks.map((link) => (
                <button key={link.id} onClick={() => scrollToSection(link.id)} className="text-left text-[1.125rem] font-semibold text-[var(--color-on-surface)] py-3 px-4 rounded-xl hover:bg-black/[0.03] active:bg-black/[0.05] transition-colors">
                  {link.label}
                </button>
              ))}
              <Link href="/auth/register" prefetch={true} className="mt-4 flex items-center justify-center h-12 rounded-xl bg-[var(--color-primary)] text-white font-bold text-[1rem] shadow-[0_8px_20px_rgba(20,128,60,0.2)] hover:opacity-90 active:scale-[0.98] transition-all">
                Get Started
              </Link>
            </div>
          )}
        </header>
      </div>

      <main className="overflow-x-clip">
        {/* ── SECTION 1: HERO ── */}
        <section id="home" className="min-h-[calc(100vh-5rem)] md:min-h-0 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-24 px-6 max-w-5xl mx-auto flex flex-col justify-center items-center text-center">
          <div className="flex flex-col items-center w-full">
            <div className="relative group mb-10 md:mb-12">
              <div className="absolute inset-0 bg-[var(--color-primary)] opacity-20 blur-xl rounded-full scale-110"></div>
              <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary)]/10 text-[0.8125rem] font-semibold text-[var(--color-primary)] shadow-sm animate-[float-subtle_4s_ease-in-out_infinite]">
                <span className="text-[0.875rem]">🇳🇬</span> Built for Nigerian Households
              </div>
            </div>
            
            <h1 className="text-[clamp(2rem,4vw+1rem,3.25rem)] font-extrabold leading-[1.15] tracking-tight text-[var(--color-on-surface)] max-w-[850px] mb-6 md:mb-8">
              Plan Your Week's Meals in <span className="text-[var(--color-primary)]">Under 60 Seconds</span>
            </h1>
            
            <p className="text-[1rem] md:text-[1.125rem] text-[var(--color-on-surface-variant)] opacity-70 leading-relaxed max-w-[600px] mb-12 md:mb-14">
              Enter your budget and ingredients. Get a 7-day meal plan and shopping list instantly.
            </p>
            
            <div className="w-full sm:w-auto flex flex-col items-center">
              <Link href="/auth/register" prefetch={true} className="inline-flex items-center justify-center h-14 px-10 rounded-xl bg-[var(--color-primary)] text-white text-[1rem] font-bold hover:opacity-90 transition-opacity shadow-[0_8px_20px_rgb(0,0,0,0.12)] w-full sm:w-auto">
                Generate My First Meal Plan
              </Link>
              
              {/* Social Proof Row */}
              <div className="mt-8 flex flex-wrap justify-center gap-5 text-[0.8125rem] font-medium text-[var(--color-on-surface-variant)]">
                <span className="flex items-center gap-2 group cursor-default"><Sparkles className="w-4 h-4 text-[var(--color-primary)] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" strokeWidth={2} /> Nigerian Meals</span>
                <span className="flex items-center gap-2 group cursor-default"><Sparkles className="w-4 h-4 text-[var(--color-primary)] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" strokeWidth={2} /> Budget Planning</span>
                <span className="flex items-center gap-2 group cursor-default"><Sparkles className="w-4 h-4 text-[var(--color-primary)] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" strokeWidth={2} /> Smart Shopping Lists</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: TRUST BAR ── */}
        <section className="py-12 overflow-hidden relative">
          {/* Gradient Masks for smooth fade at edges */}
          <div className="absolute top-0 bottom-0 left-0 w-32 md:w-64 bg-gradient-to-r from-[var(--color-background)] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-32 md:w-64 bg-gradient-to-l from-[var(--color-background)] to-transparent z-10 pointer-events-none"></div>
          
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]" style={{ animationDuration: '40s' }}>
            {[...Array(2)].map((_, arrayIndex) => (
              <div key={arrayIndex} className="flex items-center gap-8 md:gap-12 px-4 md:px-6">
                {[
                  "Nigerian Meals",
                  "Budget Planning",
                  "Smart Shopping Lists",
                  "Meal History",
                  "WhatsApp Sharing"
                ].map((metric, i) => (
                  <div key={`${arrayIndex}-${i}`} className="group flex items-center gap-3 px-8 py-4 rounded-[100px] bg-[var(--color-surface)] text-[var(--color-on-surface)] font-medium text-[0.9375rem] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-default whitespace-nowrap border border-transparent">
                    <div className="flex items-center justify-center bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] group-hover:bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)] w-8 h-8 rounded-full transition-colors duration-300">
                      <Sparkles className="w-4 h-4 text-[var(--color-primary)] opacity-90 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-300" strokeWidth={2.5} />
                    </div>
                    {metric}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: HOW IT WORKS ── */}
        <section id="how-it-works" className="py-12 md:py-24 px-6 relative z-20 overflow-hidden">
          {/* Base background with 85% opacity (reduced by 15%) */}
          <div className="absolute inset-0 bg-[var(--color-surface-container-low)] opacity-85 pointer-events-none"></div>
          
          {/* Soft primary radial gradient glow for enhanced beauty */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[var(--color-primary)] opacity-[0.08] blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16 space-y-4">
            <h2 className="text-[clamp(1.75rem,3vw,2rem)] font-extrabold text-[var(--color-on-surface)] tracking-tight">
              How it <span className="text-[var(--color-primary)]">works</span>
            </h2>
            <p className="text-[1rem] text-[var(--color-on-surface-variant)] font-normal opacity-80">Four simple steps to a week of stress-free eating.</p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 relative">
            {[
              { 
                step: 1, 
                title: "Set Your Budget", 
                desc: "Tell us your weekly budget and household size to get started.",
                icon: Wallet,
              },
              { 
                step: 2, 
                title: "Add Ingredients", 
                desc: "Input what you already have in your kitchen or pantry.",
                icon: Carrot,
              },
              { 
                step: 3, 
                title: "Generate Plan", 
                desc: "Our AI builds a personalized 7-day Nigerian meal plan.",
                icon: Sparkles,
              },
              { 
                step: 4, 
                title: "Shop & Cook", 
                desc: "Get a smart shopping list and start cooking your meals.",
                icon: ShoppingBag,
              }
            ].map((item) => (
              <div 
                key={item.step} 
                className="bg-[var(--color-surface-container-lowest)] rounded-[24px] p-5 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[var(--color-outline-variant)]/40 flex-1 relative flex flex-col items-start w-full transition-all hover:bg-[var(--color-surface-container-low)] hover:-translate-y-1 duration-300"
                style={{ zIndex: 40 - item.step * 10 }}
              >
                {/* Pill with bolts */}
                <div className="flex items-center gap-1.5 bg-[var(--color-primary)]/10 rounded-full px-3 py-1.5 mb-8">
                  {[1, 2, 3, 4].map((bolt) => (
                    <Zap 
                      key={bolt} 
                      className={`w-[14px] h-[14px] ${bolt <= item.step ? 'text-[var(--color-primary)] fill-[var(--color-primary)]' : 'text-[var(--color-primary)]/20 fill-[var(--color-primary)]/20'}`} 
                    />
                  ))}
                </div>

                {/* Icon */}
                <item.icon className="w-7 h-7 text-[var(--color-primary)] mb-5" strokeWidth={2.5} />

                {/* Text */}
                <h3 className="text-[1.125rem] md:text-[1.25rem] font-bold text-[var(--color-on-surface)] mb-3">{item.title}</h3>
                <p className="text-[0.875rem] md:text-[0.9375rem] font-normal text-[var(--color-on-surface-variant)] leading-relaxed opacity-80">
                  {item.desc}
                </p>

                {/* Arrow (except last) */}
                {item.step < 4 && (
                  <div className="absolute top-1/2 left-full ml-3 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/60 shadow-sm flex items-center justify-center z-10 hidden lg:flex">
                    <ChevronRight className="w-4 h-4 text-[var(--color-on-surface-variant)]" strokeWidth={3} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-16 text-[0.9375rem] font-medium text-[var(--color-on-surface-variant)] leading-relaxed">
            Generate a complete 7-day meal plan in seconds. Stop guessing what to cook — <br className="hidden md:block"/> start eating better.
          </div>
          </div>
        </section>

        {/* ── SECTION 4: INTERACTIVE DEMO ── */}
        <section className="py-12 md:py-24 px-6 bg-[var(--color-surface-container-low)] relative overflow-hidden">
          {/* Subtle Ambient Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[var(--color-primary)] opacity-[0.05] blur-[120px] rounded-full pointer-events-none"></div>

          <div className="max-w-6xl mx-auto relative z-10">
            {/* Header */}
            <div className="text-center mb-20 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[0.75rem] font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5" /> ✨ AI-Powered Planning
              </div>
              <h2 className="text-[clamp(1.75rem,3vw+0.5rem,2.25rem)] font-extrabold text-[var(--color-on-surface)] tracking-tight leading-tight">
                See PlateUp <span className="text-[var(--color-primary)]">Build Your Meal Plan</span>
              </h2>
            </div>
            
            <div className="flex flex-col md:flex-row gap-12 lg:gap-20 items-center justify-center relative">
              
              {/* Connection Line (Desktop only) */}
              <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-[2px] items-center overflow-hidden">
                <div className="w-full h-[2px] bg-[var(--color-primary)]/20 rounded-full"></div>
                <div className="absolute top-0 left-0 w-8 h-[2px] bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)] rounded-full animate-[marquee_2s_linear_infinite]" style={{ animationDuration: '1.5s' }}></div>
              </div>

              {/* Left Panel: AI Command Center */}
              <div className="w-full md:w-1/2 max-w-[420px] bg-[var(--color-surface)] p-6 md:p-8 rounded-[32px] shadow-lg relative z-10">
                <div className="space-y-8">
                  {/* Budget */}
                  <div className={`transition-all duration-700 ease-out ${demoStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <label className="text-[0.6875rem] uppercase font-bold text-[var(--color-on-surface-variant)] tracking-widest">Weekly Budget</label>
                    <div className="mt-2 text-[32px] font-extrabold text-[var(--color-on-surface)] tracking-tight">₦10,000</div>
                  </div>

                  {/* Ingredients */}
                  <div className={`transition-all duration-700 ease-out ${demoStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <label className="text-[0.6875rem] uppercase font-bold text-[var(--color-on-surface-variant)] tracking-widest mb-3 block">Available Ingredients</label>
                    <div className="flex flex-wrap gap-2.5">
                      {["Rice", "Beans", "Eggs", "Tomatoes"].map((ing) => (
                        <span key={ing} className="px-4 py-2 bg-[var(--color-surface-container-low)] rounded-full text-[0.8125rem] font-bold text-[var(--color-on-surface)] shadow-sm">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Button & AI status */}
                  <div className={`transition-all duration-700 ease-out ${demoStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="w-full h-14 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center text-white font-bold text-[0.9375rem] shadow-md relative overflow-hidden group">
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      <Sparkles className="w-4 h-4 mr-2" /> Generate Meal Plan
                    </div>
                    
                    {/* Analyzing Steps */}
                    <div className="mt-6 space-y-3.5 px-2">
                      <div className={`flex items-center gap-3 text-[0.8125rem] font-normal text-[var(--color-on-surface-variant)] transition-all duration-500 transform ${demoStep >= 4 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                        <span className="text-[1rem]">✨</span> Optimizing meals
                      </div>
                      <div className={`flex items-center gap-3 text-[0.8125rem] font-normal text-[var(--color-on-surface-variant)] transition-all duration-500 transform ${demoStep >= 5 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                        <span className="text-[1rem]">✨</span> Rebalancing ingredients
                      </div>
                      <div className={`flex items-center gap-3 text-[0.8125rem] font-normal text-[var(--color-on-surface-variant)] transition-all duration-500 transform ${demoStep >= 6 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                        <span className="text-[1rem]">✨</span> Reducing weekly cost
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel: Dashboard Result Card */}
              <div className={`w-full md:w-1/2 max-w-[440px] relative z-10 transition-all duration-700 ease-out transform ${demoStep >= 4 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                <div className="bg-[var(--color-surface)] rounded-[32px] shadow-lg p-6 md:p-8 relative overflow-hidden transition-colors duration-1000">
                  
                  {/* Subtle Top Glow depending on state */}
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent to-transparent opacity-50 transition-colors duration-1000 ${demoStep >= 7 ? 'via-[var(--color-primary)]' : 'via-red-500'}`}></div>

                  {/* Header / Budget Status */}
                  <div className="flex flex-col mb-6 pb-6 border-b border-[var(--color-outline-variant)]/30 relative">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-[1rem] font-extrabold text-[var(--color-on-surface)] tracking-tight">Generated Weekly Plan</h3>
                      
                      {/* State 1: Over Budget */}
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 text-red-600 text-[0.6875rem] font-bold rounded-full absolute right-0 transition-all duration-500 ${demoStep >= 4 && demoStep < 7 ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                        🔴 Over Budget
                      </div>
                      
                      {/* State 2: Within Budget */}
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[0.6875rem] font-bold rounded-full absolute right-0 transition-all duration-500 ${demoStep >= 7 ? 'opacity-100 transform-none' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                        <Check className="w-3 h-3 text-[var(--color-primary)]" strokeWidth={3} /> Within Budget
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-[0.625rem] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Est. Weekly Cost</div>
                        {/* Number change effect */}
                        <div className="relative h-[28px] overflow-hidden">
                          <div className={`absolute left-0 text-[1.5rem] font-extrabold text-[var(--color-on-surface)] transition-transform duration-700 ease-out ${demoStep >= 7 ? '-translate-y-full' : 'translate-y-0'}`}>₦14,500</div>
                          <div className={`absolute left-0 text-[1.5rem] font-extrabold text-[var(--color-on-surface)] transition-transform duration-700 ease-out ${demoStep >= 7 ? 'translate-y-0' : 'translate-y-full'}`}>₦9,500</div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className={`text-[0.625rem] font-bold uppercase tracking-widest transition-colors duration-700 ${demoStep >= 7 ? 'text-[var(--color-primary)]' : 'text-red-500'}`}>
                          {demoStep >= 7 ? 'Savings' : 'Over By'}
                        </div>
                        <div className="relative h-[28px] overflow-hidden">
                          <div className={`absolute left-0 text-[1.5rem] font-extrabold text-red-500 transition-transform duration-700 ease-out ${demoStep >= 7 ? '-translate-y-full' : 'translate-y-0'}`}>₦4,500</div>
                          <div className={`absolute left-0 text-[1.5rem] font-extrabold text-[var(--color-primary)] transition-transform duration-700 ease-out ${demoStep >= 7 ? 'translate-y-0' : 'translate-y-full'}`}>₦500</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MONDAY Content (Reveals after budget is optimized) */}
                  <div className={`transition-all duration-1000 ease-in-out overflow-hidden ${demoStep >= 7 ? 'max-h-[500px] opacity-100 mt-0' : 'max-h-0 opacity-0 mt-0'}`}>
                    <div className="space-y-6 pt-2">
                      <div className="text-[0.6875rem] uppercase font-bold text-[var(--color-on-surface-variant)] tracking-widest border-b border-[var(--color-outline-variant)]/30 pb-2">Monday</div>
                      
                      <div className="grid grid-cols-1 gap-5">
                        <div>
                          <div className="text-[0.6875rem] font-bold text-[var(--color-primary)] mb-0.5 uppercase tracking-widest">Breakfast</div>
                          <div className="text-[0.9375rem] font-medium text-[var(--color-on-surface)]">Akara & Pap</div>
                        </div>

                        <div>
                          <div className="text-[0.6875rem] font-bold text-[var(--color-primary)] mb-0.5 uppercase tracking-widest">Lunch</div>
                          <div className="text-[0.9375rem] font-medium text-[var(--color-on-surface)]">Jollof Rice</div>
                        </div>

                        <div>
                          <div className="text-[0.6875rem] font-bold text-[var(--color-primary)] mb-0.5 uppercase tracking-widest">Dinner</div>
                          <div className="text-[0.9375rem] font-medium text-[var(--color-on-surface)]">Egusi Soup</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Success Metrics */}
                  <div className={`transition-all duration-1000 ease-in-out overflow-hidden ${demoStep >= 7 ? 'max-h-[200px] opacity-100 mt-6 pt-6 border-t border-[var(--color-outline-variant)]/30' : 'max-h-0 opacity-0 mt-0 pt-0 border-transparent'}`}>
                    <div className="space-y-3">
                      {[
                        "Uses Available Ingredients",
                        "Shopping List Ready",
                        "Budget Optimized",
                        "Nigerian Meals"
                      ].map((metric, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-[0.8125rem] font-normal text-[var(--color-on-surface-variant)] opacity-80">
                          <div className="bg-[var(--color-primary)]/10 rounded-full p-0.5"><Check className="w-3 h-3 text-[var(--color-primary)]" strokeWidth={3} /></div>
                          {metric}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── SECTION 5: BENTO FEATURE GRID ── */}
        <section id="features" className="py-12 md:py-24 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-[clamp(1.75rem,3vw,2rem)] font-extrabold text-[var(--color-on-surface)] tracking-tight">Everything your household needs</h2>
            <p className="text-[1rem] text-[var(--color-on-surface-variant)] font-normal opacity-80 max-w-2xl mx-auto">Powerful tools designed to save you time, reduce waste, and keep your budget on track.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[minmax(240px,auto)]">
            {/* Large Card: AI Weekly Meal Plans */}
            <div className="md:col-span-2 md:row-span-2 bg-[var(--color-surface)] rounded-[32px] p-6 md:p-12 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-500 flex flex-col overflow-hidden relative group">
              <div className="absolute inset-0 bg-[var(--color-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              
              <div className="z-10 relative max-w-sm mb-8 md:mb-0">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[0.75rem] font-bold shadow-sm mb-6">
                  <Sparkles className="w-3.5 h-3.5" /> AI Engine
                </div>
                <h3 className="text-[clamp(1.75rem,3vw,2rem)] font-semibold text-[var(--color-on-surface)] tracking-tight mb-4">AI Weekly Meal Plans</h3>
                <p className="text-[0.9375rem] font-normal text-[var(--color-on-surface-variant)] opacity-[0.85] leading-relaxed">Intelligently generated 7-day menus focusing on Nigerian cuisine and your exact household requirements.</p>
              </div>
              
              {/* Fake UI Graphic */}
              <div className="relative md:absolute right-0 bottom-0 mt-8 md:mt-0 -mb-8 md:mb-0 -mr-8 md:mr-0 ml-auto md:ml-0 w-[calc(100%+2rem)] md:w-[65%] bg-[var(--color-surface-container-lowest)] rounded-tl-[32px] shadow-[-20px_-20px_40px_rgba(0,0,0,0.03)] p-6 md:p-8 transform group-hover:-translate-y-3 md:group-hover:-translate-x-3 transition-transform duration-700 ease-out flex flex-col gap-5 border-t border-l border-[var(--color-outline-variant)]/30">
                
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[0.75rem] uppercase font-bold text-[var(--color-on-surface-variant)] tracking-widest">Monday</div>
                  <div className="text-[0.75rem] font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded">Ready</div>
                </div>

                <div className="flex items-center gap-4 bg-[var(--color-surface)] p-3 rounded-2xl shadow-sm">
                  <div className="w-12 h-12 bg-orange-50 rounded-[14px] flex items-center justify-center">
                    <Coffee className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="h-2 w-16 bg-[var(--color-primary)]/30 rounded-full"></div>
                    <div className="h-3 w-32 bg-[var(--color-on-surface)]/20 rounded-full"></div>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-[var(--color-surface)] p-3 rounded-2xl shadow-sm">
                  <div className="w-12 h-12 bg-red-50 rounded-[14px] flex items-center justify-center">
                    <Utensils className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="h-2 w-16 bg-[var(--color-primary)]/30 rounded-full"></div>
                    <div className="h-3 w-28 bg-[var(--color-on-surface)]/20 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Medium Card 1: Smart Shopping Lists */}
            <div className="bg-[var(--color-surface)] rounded-[32px] p-6 md:p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-500 flex flex-col overflow-hidden relative group">
              <div className="z-10 relative mb-40 md:mb-24">
                <h3 className="text-[1.25rem] font-semibold text-[var(--color-on-surface)] tracking-tight mb-3">Smart Shopping Lists</h3>
                <p className="text-[0.875rem] font-normal text-[var(--color-on-surface-variant)] opacity-[0.85] leading-relaxed">Automatically extracted ingredients structured for easy market runs.</p>
              </div>
              <div className="absolute bottom-0 left-8 right-8 bg-[var(--color-surface-container-lowest)] rounded-t-[24px] shadow-[0_-15px_40px_rgba(0,0,0,0.04)] p-6 transform group-hover:-translate-y-3 transition-transform duration-700 ease-out space-y-4 border-t border-x border-[var(--color-outline-variant)]/30">
                <div className="flex items-center gap-3.5"><div className="w-5 h-5 rounded-full bg-[var(--color-primary)] flex items-center justify-center"><Check className="w-3 h-3 text-white" strokeWidth={3} /></div><div className="h-3 w-28 bg-[var(--color-on-surface)]/20 rounded-full"></div></div>
                <div className="flex items-center gap-3.5"><div className="w-5 h-5 rounded-[6px] border-2 border-[var(--color-outline-variant)]"></div><div className="h-3 w-36 bg-[var(--color-on-surface)]/10 rounded-full"></div></div>
                <div className="flex items-center gap-3.5"><div className="w-5 h-5 rounded-[6px] border-2 border-[var(--color-outline-variant)]"></div><div className="h-3 w-20 bg-[var(--color-on-surface)]/10 rounded-full"></div></div>
              </div>
            </div>

            {/* Medium Card 2: Budget Optimization */}
            <div className="bg-[var(--color-surface)] rounded-[32px] p-6 md:p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-500 flex flex-col overflow-hidden relative group">
              <div className="z-10 relative mb-24">
                <h3 className="text-[1.25rem] font-semibold text-[var(--color-on-surface)] tracking-tight mb-3">Budget Optimization</h3>
                <p className="text-[0.875rem] font-normal text-[var(--color-on-surface-variant)] opacity-[0.85] leading-relaxed">Algorithms prioritize affordable ingredients to stay within your limits.</p>
              </div>
              <div className="absolute bottom-0 left-8 right-8 bg-[var(--color-surface-container-lowest)] rounded-t-[24px] shadow-[0_-15px_40px_rgba(0,0,0,0.04)] p-6 transform group-hover:-translate-y-3 transition-transform duration-700 ease-out border-t border-x border-[var(--color-outline-variant)]/30 flex flex-col justify-end">
                <div className="flex justify-between items-end mb-2.5">
                  <div className="text-[0.6875rem] font-bold text-[var(--color-primary)] uppercase tracking-widest">Within Budget</div>
                  <div className="text-[1rem] font-extrabold text-[var(--color-on-surface)]">₦9,500</div>
                </div>
                <div className="w-full h-2.5 bg-[var(--color-surface-container-low)] rounded-full overflow-hidden">
                  <div className="w-[65%] h-full bg-[var(--color-primary)] rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Small Cards Row */}
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Small Card 1 */}
              <div className="bg-[var(--color-surface)] rounded-[32px] p-6 md:p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-500 flex flex-col group overflow-hidden relative">
                <h3 className="text-[1.125rem] font-semibold text-[var(--color-on-surface)] mb-2 relative z-10 tracking-tight">Meal History</h3>
                <p className="text-[0.875rem] font-normal text-[var(--color-on-surface-variant)] opacity-[0.85] relative z-10">Access previous entries.</p>
                <div className="mt-8 flex flex-col gap-2.5 relative z-10 transform group-hover:-translate-y-2 transition-transform duration-700 ease-out">
                  <div className="h-10 w-full bg-[var(--color-surface-container-low)] rounded-xl flex items-center px-4 gap-3"><History className="w-4 h-4 text-[var(--color-on-surface-variant)] opacity-50" /><div className="h-2.5 w-16 bg-[var(--color-on-surface)]/20 rounded-full"></div></div>
                  <div className="h-10 w-[85%] bg-[var(--color-surface-container-low)] rounded-xl flex items-center px-4 gap-3"><History className="w-4 h-4 text-[var(--color-on-surface-variant)] opacity-50" /><div className="h-2.5 w-24 bg-[var(--color-on-surface)]/10 rounded-full"></div></div>
                </div>
              </div>

              {/* Small Card 2 */}
              <div className="bg-[var(--color-surface)] rounded-[32px] p-6 md:p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-500 flex flex-col group overflow-hidden relative">
                <h3 className="text-[1.125rem] font-semibold text-[var(--color-on-surface)] mb-2 relative z-10 tracking-tight">Ingredient Reuse</h3>
                <p className="text-[0.875rem] font-normal text-[var(--color-on-surface-variant)] opacity-[0.85] relative z-10">Minimize food waste.</p>
                <div className="mt-8 flex flex-wrap gap-2 relative z-10 transform group-hover:-translate-y-2 transition-transform duration-700 ease-out">
                  <div className="px-4 py-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[0.75rem] font-bold rounded-full">Rice</div>
                  <div className="px-4 py-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[0.75rem] font-bold rounded-full">Tomatoes</div>
                  <div className="px-4 py-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[0.75rem] font-bold rounded-full opacity-50">Chicken</div>
                </div>
              </div>

              {/* Small Card 3 */}
              <div className="bg-[var(--color-surface)] rounded-[32px] p-6 md:p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-500 flex flex-col group overflow-hidden relative">
                <h3 className="text-[1.125rem] font-semibold text-[var(--color-on-surface)] mb-2 relative z-10 tracking-tight">WhatsApp Sharing</h3>
                <p className="text-[0.875rem] font-normal text-[var(--color-on-surface-variant)] opacity-[0.85] relative z-10">Send lists instantly.</p>
                <div className="mt-8 bg-[#25D366]/10 rounded-t-[20px] p-4 relative z-10 transform group-hover:-translate-y-2 transition-transform duration-700 ease-out translate-y-3">
                  <div className="w-20 h-2.5 bg-[#25D366]/40 rounded-full mb-3"></div>
                  <div className="w-full h-2.5 bg-[#25D366]/20 rounded-full mb-2"></div>
                  <div className="w-3/4 h-2.5 bg-[#25D366]/20 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <PopularMealsMarquee />

        {/* ── SECTION 6: BEFORE VS AFTER ── */}
        <section className="py-12 md:py-24 px-6 bg-[var(--color-surface-container-low)] relative">
          <div className="max-w-5xl mx-auto">
            
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-[clamp(1.75rem,3vw,2rem)] font-extrabold text-[var(--color-on-surface)] tracking-tight">The difference is <span className="text-[var(--color-primary)]">clear</span></h2>
            </div>

            <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 md:gap-12 relative">
              
              {/* Without PlateUp */}
              <div className="w-full md:w-1/2 bg-[var(--color-surface)] rounded-[32px] p-6 md:p-12 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="absolute inset-0 bg-red-500/[0.02] pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-400/40 to-transparent opacity-50"></div>
                
                <h3 className="text-[0.875rem] font-bold uppercase tracking-widest text-red-500 mb-8 flex items-center gap-2 relative z-10">
                  <XCircle className="w-5 h-5" /> Without PlateUp
                </h3>
                
                <ul className="space-y-6 relative z-10">
                  {[
                    "Overspending at the market",
                    "Repeating the same meals",
                    "Wasting unused ingredients",
                    "Last-minute cooking decisions"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-[0.9375rem] font-medium text-[var(--color-on-surface-variant)]">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <X className="w-3 h-3 text-red-500" strokeWidth={3} />
                      </div> 
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Transformation Arrow (Desktop) */}
              <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-[var(--color-surface)] rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.08)] items-center justify-center z-10 text-[var(--color-on-surface-variant)]">
                <ArrowRight className="w-6 h-6" strokeWidth={2.5} />
              </div>

              {/* With PlateUp */}
              <div className="w-full md:w-1/2 bg-[var(--color-surface)] rounded-[32px] p-6 md:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.06)] relative overflow-hidden group hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-shadow">
                <div className="absolute inset-0 bg-[var(--color-primary)]/[0.03] pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent"></div>
                
                <h3 className="text-[0.875rem] font-bold uppercase tracking-widest text-[var(--color-primary)] mb-8 flex items-center gap-2 relative z-10">
                  <CheckCircle2 className="w-5 h-5" /> With PlateUp
                </h3>
                
                <ul className="space-y-6 mb-10 relative z-10">
                  {[
                    "Weekly meal plan ready instantly",
                    "Budget-aware recommendations",
                    "Smart shopping list",
                    "Better ingredient utilization"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-[0.9375rem] font-semibold text-[var(--color-on-surface)]">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-[var(--color-primary)]" strokeWidth={3} />
                      </div> 
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Benefit Chips */}
                <div className="pt-8 border-t border-[var(--color-outline-variant)]/40 flex flex-wrap gap-2.5 relative z-10">
                  {[
                    "Saves Planning Time",
                    "Reduces Food Waste",
                    "Helps Stay On Budget"
                  ].map((chip, i) => (
                    <span key={i} className="px-3.5 py-1.5 bg-[var(--color-surface)] rounded-full text-[0.75rem] font-bold text-[var(--color-on-surface-variant)] shadow-sm border border-[var(--color-outline-variant)]/30 flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-[var(--color-primary)]" strokeWidth={3} /> {chip}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── SECTION 7: PRODUCT SHOWCASE ── */}
        <section className="py-12 md:py-24 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-[clamp(1.75rem,3vw,2rem)] font-extrabold text-[var(--color-on-surface)] tracking-tight">Built for clarity and focus</h2>
          </div>
          <div className="w-full bg-white rounded-[32px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.03)] overflow-hidden relative">
            {/* Fake Browser Header */}
            <div className="h-14 bg-[#fcfcfc] flex items-center px-6 gap-6 relative shadow-[inset_0_-1px_0_rgba(0,0,0,0.03)]">
              <div className="flex gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05),0_0_0_1px_rgba(0,0,0,0.04)] rounded-lg h-8 px-6 text-[0.75rem] font-bold text-[var(--color-on-surface-variant)]">
                app.plateup.app
              </div>
            </div>
            
            {/* App Body Preview */}
            <div ref={showcaseRef} className="p-5 md:p-12 bg-[#fafafa] flex flex-col lg:flex-row gap-8 lg:gap-12 items-start relative overflow-hidden">
              
              {/* AI Connection Line (Desktop only) */}
              <div className="hidden lg:block absolute top-1/2 left-[310px] w-[60px] h-[2px] bg-green-500/10 z-0 overflow-hidden -translate-y-1/2 rounded-full">
                 {showcaseState === 'generating' && (
                   <div 
                      className="w-[15px] h-full bg-gradient-to-r from-transparent via-green-500/40 to-transparent animate-[marquee_1.2s_linear_infinite]"
                   />
                 )}
              </div>
              
              {/* Sidebar - Budget & Inputs (Tertiary) */}
              <div className="w-full lg:w-[280px] flex-shrink-0 space-y-6">
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.03)] ring-1 ring-black/[0.02]">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[0.75rem] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider">Weekly Budget</label>
                      <div className="h-12 bg-[#f4f5f7] rounded-xl px-4 flex items-center font-semibold text-[1rem] text-[var(--color-on-surface)] opacity-85">₦ 15,000</div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[0.75rem] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider">Available Ingredients</label>
                      <div className="bg-[#f4f5f7] rounded-xl p-4 font-medium text-[0.875rem] text-[var(--color-on-surface)] leading-relaxed opacity-85 transition-all duration-300">
                        {SHOWCASE_DAYS[showcaseDayIndex].ingredients}
                      </div>
                    </div>
                    <div className="pt-4">
                      <div className="h-12 bg-[var(--color-primary)] text-white font-bold text-[0.875rem] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20 opacity-90 transition-all duration-300">
                        {showcaseState === 'idle' && "Generate Meal Plan"}
                        {showcaseState === 'generating' && (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin text-white/80" />
                            Generating...
                          </>
                        )}
                        {showcaseState === 'generated' && "Meal Plan Generated"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Main Content Area */}
              <div className="flex-1 flex flex-col gap-8 w-full">
                
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  
                  {/* Meal Plan (Primary Focus) */}
                  <div className="flex-1 w-full bg-white rounded-3xl p-6 md:p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.03] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-[var(--color-primary)]"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/[0.03] to-transparent pointer-events-none"></div>
                    
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8 relative z-10">
                      <h3 className="text-[1.5rem] font-semibold text-[var(--color-on-surface)]">Your Plan</h3>
                      <span 
                        className={`px-3.5 py-1.5 bg-green-50 text-green-700 text-[0.75rem] font-bold rounded-full flex items-center gap-2 ring-1 ring-green-600/20 shadow-sm transition-all duration-500 ease-out transform ${showcaseState === 'generated' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                      >
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Within Budget
                      </span>
                    </div>
                    
                    <div className="space-y-6 relative z-10">
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-3 py-1.5 rounded-lg">
                          <Calendar className="w-4 h-4" /> {SHOWCASE_DAYS[showcaseDayIndex].day}
                        </div>
                        {showcaseState !== 'generated' ? (
                          <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center gap-5 bg-[#f8f9fa] p-4 rounded-2xl animate-pulse">
                              <div className="w-10 h-10 rounded-full bg-black/5" />
                              <div className="h-4 bg-black/5 rounded w-2/3" />
                            </div>
                            <div className="flex items-center gap-5 bg-[#f8f9fa] p-4 rounded-2xl animate-pulse" style={{ animationDelay: '150ms' }}>
                              <div className="w-10 h-10 rounded-full bg-black/5" />
                              <div className="h-4 bg-black/5 rounded w-1/2" />
                            </div>
                            <div className="flex items-center gap-5 bg-[#f8f9fa] p-4 rounded-2xl animate-pulse" style={{ animationDelay: '300ms' }}>
                              <div className="w-10 h-10 rounded-full bg-black/5" />
                              <div className="h-4 bg-black/5 rounded w-3/4" />
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center gap-5 bg-[#f8f9fa] p-4 rounded-2xl group hover:bg-green-50/50 transition-colors animate-slide-up-fade">
                              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[0.8125rem] font-semibold text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary)] transition-colors">B</div>
                              <div className="text-[0.9375rem] font-normal text-[var(--color-on-surface)] opacity-85">{SHOWCASE_DAYS[showcaseDayIndex].meals.b}</div>
                            </div>
                            <div className="flex items-center gap-5 bg-[#f8f9fa] p-4 rounded-2xl group hover:bg-green-50/50 transition-colors opacity-0 animate-slide-up-fade" style={{ animationDelay: '150ms' }}>
                              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[0.8125rem] font-semibold text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary)] transition-colors">L</div>
                              <div className="text-[0.9375rem] font-normal text-[var(--color-on-surface)] opacity-85">{SHOWCASE_DAYS[showcaseDayIndex].meals.l}</div>
                            </div>
                            <div className="flex items-center gap-5 bg-[#f8f9fa] p-4 rounded-2xl group hover:bg-green-50/50 transition-colors opacity-0 animate-slide-up-fade" style={{ animationDelay: '300ms' }}>
                              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[0.8125rem] font-semibold text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary)] transition-colors">D</div>
                              <div className="text-[0.9375rem] font-normal text-[var(--color-on-surface)] opacity-85">{SHOWCASE_DAYS[showcaseDayIndex].meals.d}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Shopping List (Secondary) */}
                  <div className="w-full md:w-[300px] bg-white rounded-3xl p-8 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.02] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent pointer-events-none"></div>
                    <h3 className="text-[1.125rem] font-bold text-[var(--color-on-surface)] mb-8 flex items-center gap-2.5 relative z-10">
                      <ShoppingCart className="w-5 h-5 text-[var(--color-on-surface-variant)]" />
                      Shopping List
                    </h3>
                    
                    <ul className="space-y-4 relative z-10">
                      {showcaseState !== 'generated' ? (
                        <>
                          <li className="flex items-center gap-3 animate-pulse">
                            <div className="w-6 h-6 rounded-full bg-black/5 flex-shrink-0" />
                            <div className="h-3 bg-black/5 rounded w-1/2" />
                          </li>
                          <li className="flex items-center gap-3 animate-pulse" style={{ animationDelay: '150ms' }}>
                            <div className="w-6 h-6 rounded-full bg-black/5 flex-shrink-0" />
                            <div className="h-3 bg-black/5 rounded w-1/3" />
                          </li>
                          <li className="flex items-center gap-3 animate-pulse" style={{ animationDelay: '300ms' }}>
                            <div className="w-6 h-6 rounded-full bg-black/5 flex-shrink-0" />
                            <div className="h-3 bg-black/5 rounded w-2/5" />
                          </li>
                        </>
                      ) : (
                        <div className="space-y-4">
                          {SHOWCASE_DAYS[showcaseDayIndex].shopping.map((item, i) => (
                            <li key={i} className="flex items-center gap-3 opacity-0 animate-slide-up-fade" style={{ animationDelay: `${i * 150}ms` }}>
                              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3.5 h-3.5 text-green-700" strokeWidth={3} />
                              </div>
                              <span className="text-[0.875rem] font-normal text-[var(--color-on-surface)] opacity-85">{item}</span>
                            </li>
                          ))}
                        </div>
                      )}
                    </ul>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 8: FAQ ── */}
        <section id="faq" className="py-12 md:py-24 px-6 max-w-3xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <div className="text-[0.75rem] font-bold text-[var(--color-primary)] uppercase tracking-widest">Questions & Answers</div>
            <h2 className="text-[clamp(1.75rem,3vw,2rem)] font-extrabold text-[var(--color-on-surface)] tracking-tight">Frequently Asked Questions</h2>
            <p className="text-[0.9375rem] text-[var(--color-on-surface-variant)] font-normal opacity-80 max-w-lg mx-auto">Everything you need to know before creating your first meal plan.</p>
          </div>
          
          <div className="space-y-4">
            {[
              { q: "Is PlateUp free?", a: "Yes, the MVP version of PlateUp is completely free to use." },
              { q: "Can I regenerate meal plans?", a: "Yes, if you don't like a generated plan, you can regenerate it instantly." },
              { q: "Does PlateUp use Nigerian meals?", a: "Absolutely. PlateUp's AI is specifically fine-tuned for Nigerian households, recipes, and local market ingredients." },
              { q: "Can I save meal plans?", a: "Yes, you can bookmark your favorite plans to reuse them anytime without regenerating." },
              { q: "Can I share meal plans?", a: "Yes, you can share your meal plan and shopping list directly to WhatsApp." }
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_-4px_rgba(0,0,0,0.06)] hover:-translate-y-[1px] ring-1 ring-black/[0.02]">
                <button 
                  className="w-full flex items-center justify-between p-6 text-left font-semibold text-[0.9375rem] text-[var(--color-on-surface)]"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                >
                  {faq.q}
                  <ChevronDown className={`w-4 h-4 text-[var(--color-on-surface-variant)] transition-transform duration-300 ease-in-out ${activeFaq === i ? "rotate-180" : ""}`} />
                </button>
                <div 
                  className="transition-all duration-300 ease-in-out overflow-hidden"
                  style={{ maxHeight: activeFaq === i ? '200px' : '0', opacity: activeFaq === i ? 1 : 0 }}
                >
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-[0.875rem] font-normal text-[var(--color-on-surface-variant)] leading-relaxed opacity-85">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Help Card */}
          <div className="mt-12 bg-[#fafafa] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 ring-1 ring-black/[0.02] shadow-[0_8px_30px_-4px_rgba(0,0,0,0.02)]">
            <div className="text-center md:text-left space-y-1">
              <h4 className="text-[1rem] font-semibold text-[var(--color-on-surface)]">Still have questions?</h4>
              <p className="text-[0.875rem] text-[var(--color-on-surface-variant)] opacity-85">Contact our team and we'll help you get started.</p>
            </div>
            <Link href="/contact" className="h-10 px-5 bg-white ring-1 ring-black/[0.05] shadow-sm rounded-xl flex items-center justify-center text-[0.8125rem] font-bold text-[var(--color-on-surface)] hover:bg-[#f8f9fa] hover:shadow transition-all">
              Contact Us
            </Link>
          </div>
        </section>

        {/* ── SECTION 9: FINAL CTA ── */}
        <section className="py-12 md:py-24 px-6 relative flex justify-center group">
          {/* Subtle Glow Behind Container */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-3xl h-[250px] bg-[var(--color-primary)]/20 blur-[100px] rounded-full pointer-events-none z-0 transition-opacity duration-700 opacity-50 group-hover:opacity-100"></div>

          <div className="max-w-3xl w-full mx-auto bg-gradient-to-br from-[var(--color-primary)] to-[#0c4a22] rounded-[32px] p-8 md:p-12 text-center shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)] transition-shadow duration-700 ease-out relative overflow-hidden z-10">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white opacity-[0.04] rounded-full blur-[60px] transform translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black opacity-[0.15] rounded-full blur-[60px] transform -translate-x-1/3 translate-y-1/3"></div>
            
            <div className="relative z-10 space-y-8">
              <div className="space-y-4">
                <h2 className="text-[clamp(1.75rem,3vw+0.5rem,2.25rem)] font-extrabold text-white tracking-tight leading-[1.15]">
                  Your Next Week's Meals Are <br className="hidden md:block"/>One Click Away
                </h2>
                <p className="text-[0.9375rem] md:text-[1rem] font-medium text-white/80 max-w-lg mx-auto">
                  Generate a personalized Nigerian meal plan in under a minute.
                </p>
              </div>
              
              <div className="flex flex-col items-center gap-6">
                <Link href="/auth/register" prefetch={true} className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-white text-[var(--color-primary)] text-[0.875rem] font-extrabold shadow-sm hover:shadow-[0_8px_25px_-5px_rgba(255,255,255,0.3)] hover:bg-[#fcfcfc] transition-all duration-300">
                  Generate My First Meal Plan
                  <ArrowRight className="w-4 h-4" />
                </Link>
                
                {/* Trust Chips */}
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-5">
                  {[
                    "Nigerian Meals",
                    "Budget Aware",
                    "Shopping Lists",
                    "Save Meal History"
                  ].map((chip, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[0.75rem] font-semibold text-white/80">
                      <Check className="w-3.5 h-3.5 text-white/90" strokeWidth={3} />
                      {chip}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-[var(--color-surface)] pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-8 mb-16">
            
            {/* Logo and Description */}
            <div className="max-w-xs">
              <PlateUpLogo size="sm" href="/" className="mb-6" />
              <p className="text-[0.875rem] text-[var(--color-on-surface-variant)] leading-relaxed opacity-90">
                The AI-powered meal planning engine that helps you generate, organize, and perfect budget-friendly Nigerian meal sequences.
              </p>
            </div>

            {/* Links Columns */}
            <div className="flex flex-wrap gap-16 md:gap-24">
              {/* Product */}
              <div className="space-y-5">
                <h4 className="text-[0.75rem] font-bold tracking-[0.15em] text-[var(--color-on-surface-variant)] uppercase opacity-80">Product</h4>
                <ul className="space-y-4">
                  <li><Link href="#how-it-works" className="text-[0.875rem] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">How it works</Link></li>
                  <li><Link href="#features" className="text-[0.875rem] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">Pricing</Link></li>
                  <li><Link href="/auth/login" className="text-[0.875rem] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">Sign In</Link></li>
                  <li><Link href="/auth/register" prefetch={true} className="text-[0.875rem] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">Get Started</Link></li>
                </ul>
              </div>

              {/* Company */}
              <div className="space-y-5">
                <h4 className="text-[0.75rem] font-bold tracking-[0.15em] text-[var(--color-on-surface-variant)] uppercase opacity-80">Company</h4>
                <ul className="space-y-4">
                  <li><Link href="/contact" className="text-[0.875rem] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">Contact Us</Link></li>
                  <li><Link href="#" className="text-[0.875rem] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">Twitter</Link></li>
                </ul>
              </div>

              {/* Legal */}
              <div className="space-y-5">
                <h4 className="text-[0.75rem] font-bold tracking-[0.15em] text-[var(--color-on-surface-variant)] uppercase opacity-80">Legal</h4>
                <ul className="space-y-4">
                  <li><Link href="/privacy" className="text-[0.875rem] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="text-[0.875rem] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
            
          </div>

          <div className="border-t border-[var(--color-outline-variant)]/50 pt-8 flex items-center justify-between">
            <p className="text-[0.8125rem] font-medium text-[var(--color-on-surface-variant)] opacity-80">
              © {new Date().getFullYear()} PlateUp AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

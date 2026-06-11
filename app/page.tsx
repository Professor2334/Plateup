"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlateUpLogo } from "@/components/shared/PlateUpLogo";
import { Menu, X, ArrowRight, CheckCircle2, XCircle, ChevronDown, Check, Zap, Sparkles, Receipt, ListTodo, History, MessageCircle, Wallet, Carrot, ShoppingBag, ChevronRight, Coffee, Utensils, Calendar, ShoppingCart } from "lucide-react";

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
                  <div key={`${arrayIndex}-${i}`} className="flex items-center gap-3 px-8 py-4 rounded-[100px] bg-[var(--color-surface)] text-[var(--color-on-surface)] font-bold text-[15px] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default whitespace-nowrap">
                    <Check className="w-5 h-5 text-[var(--color-primary)]" strokeWidth={3} />
                    {metric}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: HOW IT WORKS ── */}
        <section id="how-it-works" className="py-24 px-6 relative z-20 overflow-hidden">
          {/* Base background with 85% opacity (reduced by 15%) */}
          <div className="absolute inset-0 bg-[var(--color-surface-container-low)] opacity-85 pointer-events-none"></div>
          
          {/* Soft primary radial gradient glow for enhanced beauty */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[var(--color-primary)] opacity-[0.08] blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16 space-y-4">
            <h2 className="text-[28px] md:text-[32px] font-extrabold text-[var(--color-on-surface)] tracking-tight">
              How it <span className="text-[var(--color-primary)]">works</span>
            </h2>
            <p className="text-[16px] text-[var(--color-on-surface-variant)] font-normal opacity-80">Four simple steps to a week of stress-free eating.</p>
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
                className="bg-[var(--color-surface-container-lowest)] rounded-[24px] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[var(--color-outline-variant)]/40 flex-1 relative flex flex-col items-start w-full transition-all hover:bg-[var(--color-surface-container-low)] hover:-translate-y-1 duration-300"
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
                <h3 className="text-[18px] md:text-[20px] font-bold text-[var(--color-on-surface)] mb-3">{item.title}</h3>
                <p className="text-[14px] md:text-[15px] font-normal text-[var(--color-on-surface-variant)] leading-relaxed opacity-80">
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

          <div className="text-center mt-16 text-[15px] font-medium text-[var(--color-on-surface-variant)] leading-relaxed">
            Generate a complete 7-day meal plan in seconds. Stop guessing what to cook — <br className="hidden md:block"/> start eating better.
          </div>
          </div>
        </section>

        {/* ── SECTION 4: INTERACTIVE DEMO ── */}
        <section className="py-24 px-6 bg-[var(--color-surface-container-low)] relative overflow-hidden">
          {/* Subtle Ambient Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[var(--color-primary)] opacity-[0.05] blur-[120px] rounded-full pointer-events-none"></div>

          <div className="max-w-6xl mx-auto relative z-10">
            {/* Header */}
            <div className="text-center mb-20 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[12px] font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5" /> ✨ AI-Powered Planning
              </div>
              <h2 className="text-[28px] md:text-[36px] font-extrabold text-[var(--color-on-surface)] tracking-tight leading-tight">
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
              <div className="w-full md:w-1/2 max-w-[420px] bg-[var(--color-surface)] p-8 rounded-[32px] shadow-lg relative z-10">
                <div className="space-y-8">
                  {/* Budget */}
                  <div className={`transition-all duration-700 ease-out ${demoStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <label className="text-[11px] uppercase font-bold text-[var(--color-on-surface-variant)] tracking-widest">Weekly Budget</label>
                    <div className="mt-2 text-[32px] font-extrabold text-[var(--color-on-surface)] tracking-tight">₦10,000</div>
                  </div>

                  {/* Ingredients */}
                  <div className={`transition-all duration-700 ease-out ${demoStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <label className="text-[11px] uppercase font-bold text-[var(--color-on-surface-variant)] tracking-widest mb-3 block">Available Ingredients</label>
                    <div className="flex flex-wrap gap-2.5">
                      {["Rice", "Beans", "Eggs", "Tomatoes"].map((ing) => (
                        <span key={ing} className="px-4 py-2 bg-[var(--color-surface-container-low)] rounded-full text-[13px] font-bold text-[var(--color-on-surface)] shadow-sm">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Button & AI status */}
                  <div className={`transition-all duration-700 ease-out ${demoStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="w-full h-14 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center text-white font-bold text-[15px] shadow-md relative overflow-hidden group">
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      <Sparkles className="w-4 h-4 mr-2" /> Generate Meal Plan
                    </div>
                    
                    {/* Analyzing Steps */}
                    <div className="mt-6 space-y-3.5 px-2">
                      <div className={`flex items-center gap-3 text-[13px] font-normal text-[var(--color-on-surface-variant)] transition-all duration-500 transform ${demoStep >= 4 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                        <span className="text-[16px]">✨</span> Optimizing meals
                      </div>
                      <div className={`flex items-center gap-3 text-[13px] font-normal text-[var(--color-on-surface-variant)] transition-all duration-500 transform ${demoStep >= 5 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                        <span className="text-[16px]">✨</span> Rebalancing ingredients
                      </div>
                      <div className={`flex items-center gap-3 text-[13px] font-normal text-[var(--color-on-surface-variant)] transition-all duration-500 transform ${demoStep >= 6 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                        <span className="text-[16px]">✨</span> Reducing weekly cost
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
                      <h3 className="text-[16px] font-extrabold text-[var(--color-on-surface)] tracking-tight">Generated Weekly Plan</h3>
                      
                      {/* State 1: Over Budget */}
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 text-red-600 text-[11px] font-bold rounded-full absolute right-0 transition-all duration-500 ${demoStep >= 4 && demoStep < 7 ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                        🔴 Over Budget
                      </div>
                      
                      {/* State 2: Within Budget */}
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[11px] font-bold rounded-full absolute right-0 transition-all duration-500 ${demoStep >= 7 ? 'opacity-100 transform-none' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                        <Check className="w-3 h-3 text-[var(--color-primary)]" strokeWidth={3} /> Within Budget
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Est. Weekly Cost</div>
                        {/* Number change effect */}
                        <div className="relative h-[28px] overflow-hidden">
                          <div className={`absolute left-0 text-[24px] font-extrabold text-[var(--color-on-surface)] transition-transform duration-700 ease-out ${demoStep >= 7 ? '-translate-y-full' : 'translate-y-0'}`}>₦14,500</div>
                          <div className={`absolute left-0 text-[24px] font-extrabold text-[var(--color-on-surface)] transition-transform duration-700 ease-out ${demoStep >= 7 ? 'translate-y-0' : 'translate-y-full'}`}>₦9,500</div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-700 ${demoStep >= 7 ? 'text-[var(--color-primary)]' : 'text-red-500'}`}>
                          {demoStep >= 7 ? 'Savings' : 'Over By'}
                        </div>
                        <div className="relative h-[28px] overflow-hidden">
                          <div className={`absolute left-0 text-[24px] font-extrabold text-red-500 transition-transform duration-700 ease-out ${demoStep >= 7 ? '-translate-y-full' : 'translate-y-0'}`}>₦4,500</div>
                          <div className={`absolute left-0 text-[24px] font-extrabold text-[var(--color-primary)] transition-transform duration-700 ease-out ${demoStep >= 7 ? 'translate-y-0' : 'translate-y-full'}`}>₦500</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MONDAY Content (Reveals after budget is optimized) */}
                  <div className={`transition-all duration-1000 ease-in-out overflow-hidden ${demoStep >= 7 ? 'max-h-[500px] opacity-100 mt-0' : 'max-h-0 opacity-0 mt-0'}`}>
                    <div className="space-y-6 pt-2">
                      <div className="text-[11px] uppercase font-bold text-[var(--color-on-surface-variant)] tracking-widest border-b border-[var(--color-outline-variant)]/30 pb-2">Monday</div>
                      
                      <div className="grid grid-cols-1 gap-5">
                        <div>
                          <div className="text-[11px] font-bold text-[var(--color-primary)] mb-0.5 uppercase tracking-widest">Breakfast</div>
                          <div className="text-[15px] font-medium text-[var(--color-on-surface)]">Akara & Pap</div>
                        </div>

                        <div>
                          <div className="text-[11px] font-bold text-[var(--color-primary)] mb-0.5 uppercase tracking-widest">Lunch</div>
                          <div className="text-[15px] font-medium text-[var(--color-on-surface)]">Jollof Rice</div>
                        </div>

                        <div>
                          <div className="text-[11px] font-bold text-[var(--color-primary)] mb-0.5 uppercase tracking-widest">Dinner</div>
                          <div className="text-[15px] font-medium text-[var(--color-on-surface)]">Egusi Soup</div>
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
                        <div key={i} className="flex items-center gap-2.5 text-[13px] font-normal text-[var(--color-on-surface-variant)] opacity-80">
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
        <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-[32px] md:text-[40px] font-extrabold text-[var(--color-on-surface)] tracking-tight leading-tight">Everything your household needs</h2>
            <p className="text-[16px] text-[var(--color-on-surface-variant)] font-normal opacity-80 max-w-2xl mx-auto">Powerful tools designed to save you time, reduce waste, and keep your budget on track.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[minmax(240px,auto)]">
            {/* Large Card: AI Weekly Meal Plans */}
            <div className="md:col-span-2 md:row-span-2 bg-[var(--color-surface)] rounded-[32px] p-8 md:p-12 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-500 flex flex-col overflow-hidden relative group">
              <div className="absolute inset-0 bg-[var(--color-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              
              <div className="z-10 relative max-w-sm mb-32 md:mb-0">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[12px] font-bold shadow-sm mb-6">
                  <Sparkles className="w-3.5 h-3.5" /> AI Engine
                </div>
                <h3 className="text-[28px] md:text-[32px] font-semibold text-[var(--color-on-surface)] tracking-tight mb-4">AI Weekly Meal Plans</h3>
                <p className="text-[15px] font-normal text-[var(--color-on-surface-variant)] opacity-[0.85] leading-relaxed">Intelligently generated 7-day menus focusing on Nigerian cuisine and your exact household requirements.</p>
              </div>
              
              {/* Fake UI Graphic */}
              <div className="absolute right-0 bottom-0 w-[90%] md:w-[65%] bg-[var(--color-surface-container-lowest)] rounded-tl-[32px] shadow-[-20px_-20px_40px_rgba(0,0,0,0.03)] p-6 md:p-8 transform group-hover:-translate-y-3 group-hover:-translate-x-3 transition-transform duration-700 ease-out flex flex-col gap-5 border-t border-l border-[var(--color-outline-variant)]/30">
                
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[12px] uppercase font-bold text-[var(--color-on-surface-variant)] tracking-widest">Monday</div>
                  <div className="text-[12px] font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded">Ready</div>
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
            <div className="bg-[var(--color-surface)] rounded-[32px] p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-500 flex flex-col overflow-hidden relative group">
              <div className="z-10 relative mb-24">
                <h3 className="text-[20px] font-semibold text-[var(--color-on-surface)] tracking-tight mb-3">Smart Shopping Lists</h3>
                <p className="text-[14px] font-normal text-[var(--color-on-surface-variant)] opacity-[0.85] leading-relaxed">Automatically extracted ingredients structured for easy market runs.</p>
              </div>
              <div className="absolute bottom-0 left-8 right-8 bg-[var(--color-surface-container-lowest)] rounded-t-[24px] shadow-[0_-15px_40px_rgba(0,0,0,0.04)] p-6 transform group-hover:-translate-y-3 transition-transform duration-700 ease-out space-y-4 border-t border-x border-[var(--color-outline-variant)]/30">
                <div className="flex items-center gap-3.5"><div className="w-5 h-5 rounded-full bg-[var(--color-primary)] flex items-center justify-center"><Check className="w-3 h-3 text-white" strokeWidth={3} /></div><div className="h-3 w-28 bg-[var(--color-on-surface)]/20 rounded-full"></div></div>
                <div className="flex items-center gap-3.5"><div className="w-5 h-5 rounded-[6px] border-2 border-[var(--color-outline-variant)]"></div><div className="h-3 w-36 bg-[var(--color-on-surface)]/10 rounded-full"></div></div>
                <div className="flex items-center gap-3.5"><div className="w-5 h-5 rounded-[6px] border-2 border-[var(--color-outline-variant)]"></div><div className="h-3 w-20 bg-[var(--color-on-surface)]/10 rounded-full"></div></div>
              </div>
            </div>

            {/* Medium Card 2: Budget Optimization */}
            <div className="bg-[var(--color-surface)] rounded-[32px] p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-500 flex flex-col overflow-hidden relative group">
              <div className="z-10 relative mb-24">
                <h3 className="text-[20px] font-semibold text-[var(--color-on-surface)] tracking-tight mb-3">Budget Optimization</h3>
                <p className="text-[14px] font-normal text-[var(--color-on-surface-variant)] opacity-[0.85] leading-relaxed">Algorithms prioritize affordable ingredients to stay within your limits.</p>
              </div>
              <div className="absolute bottom-0 left-8 right-8 bg-[var(--color-surface-container-lowest)] rounded-t-[24px] shadow-[0_-15px_40px_rgba(0,0,0,0.04)] p-6 transform group-hover:-translate-y-3 transition-transform duration-700 ease-out border-t border-x border-[var(--color-outline-variant)]/30 flex flex-col justify-end">
                <div className="flex justify-between items-end mb-2.5">
                  <div className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-widest">Within Budget</div>
                  <div className="text-[16px] font-extrabold text-[var(--color-on-surface)]">₦9,500</div>
                </div>
                <div className="w-full h-2.5 bg-[var(--color-surface-container-low)] rounded-full overflow-hidden">
                  <div className="w-[65%] h-full bg-[var(--color-primary)] rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Small Cards Row */}
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Small Card 1 */}
              <div className="bg-[var(--color-surface)] rounded-[32px] p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-500 flex flex-col group overflow-hidden relative">
                <h3 className="text-[18px] font-semibold text-[var(--color-on-surface)] mb-2 relative z-10 tracking-tight">Meal History</h3>
                <p className="text-[14px] font-normal text-[var(--color-on-surface-variant)] opacity-[0.85] relative z-10">Access previous entries.</p>
                <div className="mt-8 flex flex-col gap-2.5 relative z-10 transform group-hover:-translate-y-2 transition-transform duration-700 ease-out">
                  <div className="h-10 w-full bg-[var(--color-surface-container-low)] rounded-xl flex items-center px-4 gap-3"><History className="w-4 h-4 text-[var(--color-on-surface-variant)] opacity-50" /><div className="h-2.5 w-16 bg-[var(--color-on-surface)]/20 rounded-full"></div></div>
                  <div className="h-10 w-[85%] bg-[var(--color-surface-container-low)] rounded-xl flex items-center px-4 gap-3"><History className="w-4 h-4 text-[var(--color-on-surface-variant)] opacity-50" /><div className="h-2.5 w-24 bg-[var(--color-on-surface)]/10 rounded-full"></div></div>
                </div>
              </div>

              {/* Small Card 2 */}
              <div className="bg-[var(--color-surface)] rounded-[32px] p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-500 flex flex-col group overflow-hidden relative">
                <h3 className="text-[18px] font-semibold text-[var(--color-on-surface)] mb-2 relative z-10 tracking-tight">Ingredient Reuse</h3>
                <p className="text-[14px] font-normal text-[var(--color-on-surface-variant)] opacity-[0.85] relative z-10">Minimize food waste.</p>
                <div className="mt-8 flex flex-wrap gap-2 relative z-10 transform group-hover:-translate-y-2 transition-transform duration-700 ease-out">
                  <div className="px-4 py-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[12px] font-bold rounded-full">Rice</div>
                  <div className="px-4 py-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[12px] font-bold rounded-full">Tomatoes</div>
                  <div className="px-4 py-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[12px] font-bold rounded-full opacity-50">Chicken</div>
                </div>
              </div>

              {/* Small Card 3 */}
              <div className="bg-[var(--color-surface)] rounded-[32px] p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-500 flex flex-col group overflow-hidden relative">
                <h3 className="text-[18px] font-semibold text-[var(--color-on-surface)] mb-2 relative z-10 tracking-tight">WhatsApp Sharing</h3>
                <p className="text-[14px] font-normal text-[var(--color-on-surface-variant)] opacity-[0.85] relative z-10">Send lists instantly.</p>
                <div className="mt-8 bg-[#25D366]/10 rounded-t-[20px] p-4 relative z-10 transform group-hover:-translate-y-2 transition-transform duration-700 ease-out translate-y-3">
                  <div className="w-20 h-2.5 bg-[#25D366]/40 rounded-full mb-3"></div>
                  <div className="w-full h-2.5 bg-[#25D366]/20 rounded-full mb-2"></div>
                  <div className="w-3/4 h-2.5 bg-[#25D366]/20 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 6: BEFORE VS AFTER ── */}
        <section className="py-24 px-6 bg-[var(--color-surface-container-low)] relative">
          <div className="max-w-5xl mx-auto">
            
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-[32px] md:text-[40px] font-extrabold text-[var(--color-on-surface)] tracking-tight leading-tight">The difference is <span className="text-[var(--color-primary)]">clear</span></h2>
            </div>

            <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 md:gap-12 relative">
              
              {/* Without PlateUp */}
              <div className="w-full md:w-1/2 bg-[var(--color-surface)] rounded-[32px] p-8 md:p-12 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="absolute inset-0 bg-red-500/[0.02] pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-400/40 to-transparent opacity-50"></div>
                
                <h3 className="text-[14px] font-bold uppercase tracking-widest text-red-500 mb-8 flex items-center gap-2 relative z-10">
                  <XCircle className="w-5 h-5" /> Without PlateUp
                </h3>
                
                <ul className="space-y-6 relative z-10">
                  {[
                    "Overspending at the market",
                    "Repeating the same meals",
                    "Wasting unused ingredients",
                    "Last-minute cooking decisions"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-[15px] font-medium text-[var(--color-on-surface-variant)]">
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
              <div className="w-full md:w-1/2 bg-[var(--color-surface)] rounded-[32px] p-8 md:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.06)] relative overflow-hidden group hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-shadow">
                <div className="absolute inset-0 bg-[var(--color-primary)]/[0.03] pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent"></div>
                
                <h3 className="text-[14px] font-bold uppercase tracking-widest text-[var(--color-primary)] mb-8 flex items-center gap-2 relative z-10">
                  <CheckCircle2 className="w-5 h-5" /> With PlateUp
                </h3>
                
                <ul className="space-y-6 mb-10 relative z-10">
                  {[
                    "Weekly meal plan ready instantly",
                    "Budget-aware recommendations",
                    "Smart shopping list",
                    "Better ingredient utilization"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-[15px] font-semibold text-[var(--color-on-surface)]">
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
                    <span key={i} className="px-3.5 py-1.5 bg-[var(--color-surface)] rounded-full text-[12px] font-bold text-[var(--color-on-surface-variant)] shadow-sm border border-[var(--color-outline-variant)]/30 flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-[var(--color-primary)]" strokeWidth={3} /> {chip}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── SECTION 7: PRODUCT SHOWCASE ── */}
        <section className="py-24 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-[28px] md:text-[32px] font-extrabold text-[var(--color-on-surface)] tracking-tight">Built for clarity and focus</h2>
          </div>
          <div className="w-full bg-white rounded-[32px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.03)] overflow-hidden relative">
            {/* Fake Browser Header */}
            <div className="h-14 bg-[#fcfcfc] flex items-center px-6 gap-6 relative shadow-[inset_0_-1px_0_rgba(0,0,0,0.03)]">
              <div className="flex gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05),0_0_0_1px_rgba(0,0,0,0.04)] rounded-lg h-8 px-6 text-[12px] font-bold text-[var(--color-on-surface-variant)]">
                app.plateup.app
              </div>
            </div>
            
            {/* App Body Preview */}
            <div className="p-8 md:p-12 bg-[#fafafa] flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
              
              {/* Sidebar - Budget & Inputs (Tertiary) */}
              <div className="w-full lg:w-[280px] flex-shrink-0 space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.03)] ring-1 ring-black/[0.02]">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[12px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">Weekly Budget</label>
                      <div className="h-12 bg-[#f4f5f7] rounded-xl px-4 flex items-center font-normal text-[16px] text-[var(--color-on-surface)]">₦ 15,000</div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[12px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">Available Ingredients</label>
                      <div className="bg-[#f4f5f7] rounded-xl p-4 font-normal text-[14px] text-[var(--color-on-surface)] leading-relaxed">Yam, Eggs, Spinach, Palm Oil</div>
                    </div>
                    <div className="pt-4">
                      <div className="h-12 bg-[var(--color-primary)] text-white font-bold text-[14px] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20 opacity-90">Generate Meal Plan</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Main Content Area */}
              <div className="flex-1 flex flex-col gap-8 w-full">
                
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  
                  {/* Meal Plan (Primary Focus) */}
                  <div className="flex-1 w-full bg-white rounded-3xl p-8 md:p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.03] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-[var(--color-primary)]"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/[0.03] to-transparent pointer-events-none"></div>
                    
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8 relative z-10">
                      <h3 className="text-[24px] font-semibold text-[var(--color-on-surface)]">Your Plan</h3>
                      <span className="px-3.5 py-1.5 bg-green-50 text-green-700 text-[12px] font-bold rounded-full flex items-center gap-2 ring-1 ring-green-600/20 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Within Budget
                      </span>
                    </div>
                    
                    <div className="space-y-6 relative z-10">
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 text-[15px] font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-3 py-1.5 rounded-lg">
                          <Calendar className="w-4 h-4" /> Monday
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex items-center gap-5 bg-[#f8f9fa] p-4 rounded-2xl group hover:bg-green-50/50 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[13px] font-normal text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary)] transition-colors">B</div>
                            <div className="text-[15px] font-normal text-[var(--color-on-surface)]">Boiled Yam & Egg Sauce</div>
                          </div>
                          <div className="flex items-center gap-5 bg-[#f8f9fa] p-4 rounded-2xl group hover:bg-green-50/50 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[13px] font-normal text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary)] transition-colors">L</div>
                            <div className="text-[15px] font-normal text-[var(--color-on-surface)]">Efo Riro</div>
                          </div>
                          <div className="flex items-center gap-5 bg-[#f8f9fa] p-4 rounded-2xl group hover:bg-green-50/50 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[13px] font-normal text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary)] transition-colors">D</div>
                            <div className="text-[15px] font-normal text-[var(--color-on-surface)]">Yam Porridge</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shopping List (Secondary) */}
                  <div className="w-full md:w-[300px] bg-white rounded-3xl p-8 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.02] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent pointer-events-none"></div>
                    <h3 className="text-[18px] font-semibold text-[var(--color-on-surface)] mb-8 flex items-center gap-2.5 relative z-10">
                      <ShoppingCart className="w-5 h-5 text-[var(--color-on-surface-variant)]" />
                      Shopping List
                    </h3>
                    
                    <ul className="space-y-4 relative z-10">
                      <li className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-green-700" strokeWidth={3} />
                        </div>
                        <span className="text-[14px] font-normal text-[var(--color-on-surface)]">Tomatoes & Peppers</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-green-700" strokeWidth={3} />
                        </div>
                        <span className="text-[14px] font-normal text-[var(--color-on-surface)]">Onions</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-green-700" strokeWidth={3} />
                        </div>
                        <span className="text-[14px] font-normal text-[var(--color-on-surface)]">Crayfish</span>
                      </li>
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
      <footer className="bg-[var(--color-surface)] pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-8 mb-16">
            
            {/* Logo and Description */}
            <div className="max-w-xs">
              <PlateUpLogo size="sm" href="/" className="mb-6" />
              <p className="text-[14px] text-[var(--color-on-surface-variant)] leading-relaxed opacity-90">
                The AI-powered meal planning engine that helps you generate, organize, and perfect budget-friendly Nigerian meal sequences.
              </p>
            </div>

            {/* Links Columns */}
            <div className="flex flex-wrap gap-16 md:gap-24">
              {/* Product */}
              <div className="space-y-5">
                <h4 className="text-[12px] font-bold tracking-[0.15em] text-[var(--color-on-surface-variant)] uppercase opacity-80">Product</h4>
                <ul className="space-y-4">
                  <li><Link href="#how-it-works" className="text-[14px] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">How it works</Link></li>
                  <li><Link href="#features" className="text-[14px] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">Pricing</Link></li>
                  <li><Link href="/auth/login" className="text-[14px] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">Sign In</Link></li>
                  <li><Link href="/auth/register" className="text-[14px] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">Get Started</Link></li>
                </ul>
              </div>

              {/* Company */}
              <div className="space-y-5">
                <h4 className="text-[12px] font-bold tracking-[0.15em] text-[var(--color-on-surface-variant)] uppercase opacity-80">Company</h4>
                <ul className="space-y-4">
                  <li><Link href="/contact" className="text-[14px] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">Contact Us</Link></li>
                  <li><Link href="#" className="text-[14px] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">Twitter</Link></li>
                </ul>
              </div>

              {/* Legal */}
              <div className="space-y-5">
                <h4 className="text-[12px] font-bold tracking-[0.15em] text-[var(--color-on-surface-variant)] uppercase opacity-80">Legal</h4>
                <ul className="space-y-4">
                  <li><Link href="/privacy" className="text-[14px] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="text-[14px] font-medium text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
            
          </div>

          <div className="border-t border-[var(--color-outline-variant)]/50 pt-8 flex items-center justify-between">
            <p className="text-[13px] font-medium text-[var(--color-on-surface-variant)] opacity-80">
              © {new Date().getFullYear()} PlateUp AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import Link from "next/link";
import { PlateUpLogo } from "@/components/shared/PlateUpLogo";

export default function LandingPage() {
  const steps = [
    { step: "1", icon: "💰", title: "Set your budget", desc: "Tell us how much you have to spend this week. PlateUp respects every naira." },
    { step: "2", icon: "🥘", title: "Add your ingredients", desc: "List what you already have at home. We'll build around it so nothing goes to waste." },
    { step: "3", icon: "✨", title: "Get your meal plan", desc: "Our AI generates a full 7-day Nigerian meal plan with a ready-to-use shopping list." },
  ];

  const features = [
    { icon: "🍲", title: "Nigerian-First Meals", desc: "Jollof Rice, Egusi, Amala and hundreds of familiar dishes your family already loves." },
    { icon: "💸", title: "Budget-Aware Planning", desc: "Set any budget — from NGN 5,000 to NGN 50,000+ — and get realistic, achievable plans." },
    { icon: "📋", title: "Auto Shopping Lists", desc: "Every meal plan comes with a complete shopping list so you never forget an ingredient." },
    { icon: "📱", title: "Share via WhatsApp", desc: "Send your weekly meal plan to family instantly with one tap." },
    { icon: "🔄", title: "Reuse Saved Plans", desc: "Save plans you love and bring them back anytime. No need to regenerate." },
    { icon: "🏠", title: "Built for Any Household", desc: "Whether you cook for 1 person or a family of 10, PlateUp scales perfectly." },
  ];

  return (
    <div className="min-h-screen bg-background font-sans">

      {/* ── Navigation ─────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <PlateUpLogo size="md" href="/" />
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-container text-on-primary-container text-sm font-semibold">
            🇳🇬 Built for Nigerian Households
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight text-on-background">
            Plan smarter meals.{" "}
            <span className="text-primary">Spend less. Eat better.</span>
          </h1>

          <p className="text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            PlateUp is the AI-powered meal planning assistant built specifically for Nigerian households.
            Enter your budget and ingredients — get a full 7-day meal plan in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto inline-flex items-center justify-center min-h-[44px] px-8 py-4 rounded-xl bg-primary text-on-primary text-base font-semibold shadow-lg hover:opacity-90 transition-all"
            >
              Start Planning for Free →
            </Link>
            <Link
              href="/auth/login"
              className="w-full sm:w-auto inline-flex items-center justify-center min-h-[44px] px-8 py-4 rounded-xl border border-outline-variant text-on-surface text-base font-semibold hover:bg-surface-low transition-all"
            >
              Sign In
            </Link>
          </div>

          <p className="text-sm text-on-surface-variant opacity-60">
            No credit card required · Free to use
          </p>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────── */}
      <section className="py-24 px-6 bg-surface-low">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-on-background">How PlateUp works</h2>
            <p className="mt-4 text-lg text-on-surface-variant">
              Three simple steps to a week of stress-free eating.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item) => (
              <div
                key={item.step}
                className="bg-surface rounded-2xl p-8 border border-outline-variant shadow-sm space-y-4"
              >
                <div className="text-4xl">{item.icon}</div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                  Step {item.step}
                </span>
                <h3 className="text-xl font-bold text-on-surface">{item.title}</h3>
                <p className="text-on-surface-variant leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-on-background">
              Everything your household needs
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl p-6 border border-outline-variant bg-surface hover:bg-surface-low transition-colors space-y-3"
              >
                <div className="text-3xl">{f.icon}</div>
                <h3 className="text-lg font-bold text-on-surface">{f.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-primary">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-on-primary">
            Start planning smarter meals today
          </h2>
          <p className="text-lg text-on-primary opacity-80">
            Join thousands of Nigerian households already using PlateUp to eat better on any budget.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center min-h-[44px] px-10 py-4 rounded-xl bg-surface text-primary font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="py-8 px-6 border-t border-outline-variant bg-surface">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <PlateUpLogo size="sm" href="/" />
          <span className="text-sm text-on-surface-variant">
            © {new Date().getFullYear()} PlateUp. Built for Nigerian households.
          </span>
        </div>
      </footer>

    </div>
  );
}

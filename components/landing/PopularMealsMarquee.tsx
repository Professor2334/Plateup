import Image from 'next/image';
import { Sparkles, Check } from 'lucide-react';

const MEALS = [
  { title: 'Jollof Rice', image: '/images/meals/jollof-rice.webp' },
  { title: 'Fried Rice', image: '/images/meals/fried-rice.webp' },
  { title: 'Beans & Plantain', image: '/images/meals/beans-plantain.webp' },
  { title: 'Yam Porridge', image: '/images/meals/yam-porridge.webp' },
  { title: 'Egusi Soup', image: '/images/meals/egusi-soup.webp' },
  { title: 'Vegetable Soup', image: '/images/meals/vegetable-soup.webp' },
  { title: 'Spaghetti', image: '/images/meals/spaghetti.webp' },
  { title: 'Rice & Stew', image: '/images/meals/rice-stew.webp' },
];

export function PopularMealsMarquee() {
  return (
    <section className="py-12 md:py-24 px-6 relative overflow-hidden bg-[var(--color-surface-container-lowest)]">
      <div className="max-w-6xl mx-auto mb-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[0.75rem] font-bold shadow-sm uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> POPULAR NIGERIAN MEALS
        </div>
        <h2 className="text-[clamp(1.75rem,3vw,2rem)] font-extrabold text-[var(--color-on-surface)] tracking-tight">
          Popular Nigerian Meals PlateUp Can Plan
        </h2>
        <p className="text-[1rem] text-[var(--color-on-surface-variant)] font-normal opacity-80 max-w-2xl mx-auto">
          Familiar Nigerian meals tailored to your budget, pantry items, and household size.
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Gradient Masks for smooth fade at edges */}
        <div className="absolute top-0 bottom-0 left-0 w-24 md:w-56 bg-gradient-to-r from-[var(--color-surface-container-lowest)] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 bottom-0 right-0 w-24 md:w-56 bg-gradient-to-l from-[var(--color-surface-container-lowest)] to-transparent z-10 pointer-events-none"></div>

        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] will-change-transform" style={{ animationDuration: '55s' }}>
          {/* Double array for seamless infinite scroll */}
          {[...MEALS, ...MEALS].map((meal, index) => (
            <div key={index} className="px-3 md:px-4">
              <div className="bg-[var(--color-surface)] rounded-[24px] p-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-[var(--color-outline-variant)]/40 flex flex-col gap-3 md:gap-4 transition-all duration-300 ease-out hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 hover:scale-[1.02] w-[280px] md:w-[320px]">
                <div className="relative w-full aspect-[4/3] rounded-[16px] md:rounded-[20px] overflow-hidden bg-[var(--color-surface-container-low)]">
                  <Image 
                    src={meal.image} 
                    alt={meal.title} 
                    fill 
                    sizes="(max-width: 768px) 280px, 320px"
                    className="object-cover object-center" 
                    loading="lazy" 
                  />
                </div>
                <div className="px-2 pb-1.5 flex flex-col gap-1.5">
                  <h3 className="text-[1.125rem] md:text-[1.25rem] font-bold text-[var(--color-on-surface)] tracking-tight">{meal.title}</h3>
                  <p className="text-[0.75rem] text-[var(--color-on-surface-variant)] font-medium opacity-80 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[var(--color-primary)] flex-shrink-0" strokeWidth={3} />
                    Can be included in your weekly plan
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

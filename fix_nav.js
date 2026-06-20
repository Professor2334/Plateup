const fs = require('fs');
const path = 'app/LandingPageClient.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove overflow-x-hidden from main container
content = content.replace(
  'pb-20 overflow-x-hidden">',
  'pb-20">'
);

// 2. Update the navbar container to be sticky
const oldNavContainer = '<div className="fixed top-0 w-full z-50 transition-all duration-300 pointer-events-none px-4 md:px-6">';
const newNavContainer = '<div className="sticky top-0 w-full z-[1000] transition-all duration-300 pointer-events-none px-4 md:px-6 pt-4 pb-2 md:pt-6 md:pb-4">';
content = content.replace(oldNavContainer, newNavContainer);

// 3. Update the header to always be glassmorphic and remove isScrolled logic
const oldHeader = '<header className={`mx-auto max-w-[1440px] pointer-events-auto transition-all duration-500 rounded-2xl ${isScrolled ? "mt-4 bg-[var(--color-surface)]/80 backdrop-blur-md border border-[var(--color-outline-variant)]/20 shadow-[0_8px_30px_rgba(0,0,0,0.08)] py-3 px-4 md:px-11" : "mt-6 bg-transparent py-4 px-4 md:px-7"}`}>';
const newHeader = '<header className="mx-auto max-w-[1440px] pointer-events-auto rounded-2xl bg-[var(--color-surface)]/85 backdrop-blur-xl border border-[var(--color-outline-variant)]/20 shadow-[0_8px_30px_rgba(0,0,0,0.08)] py-3 px-4 md:px-7 lg:px-11 transition-all duration-300">';
content = content.replace(oldHeader, newHeader);

// 4. Update the hero section top padding to account for sticky navbar
const oldHero = '<section id="home" className="min-h-[calc(100vh-5rem)] md:min-h-0 pt-32 md:pt-32 lg:pt-40 pb-16 md:pb-24 px-6 max-w-5xl mx-auto flex flex-col justify-center items-center text-center">';
const newHero = '<section id="home" className="min-h-[calc(100vh-5rem)] md:min-h-0 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-24 px-6 max-w-5xl mx-auto flex flex-col justify-center items-center text-center">';
content = content.replace(oldHero, newHero);

fs.writeFileSync(path, content);
console.log('Done');

const fs = require('fs');
let content = fs.readFileSync('components/dashboard/SavedPlansTab.tsx', 'utf8');

const replacement1 = `              const ingredientList = plan.ingredients
                .split(',')
                .map((i: string) => i.trim())
                .filter((i: string) => i.length > 0);

              let totalMeals = 21;
              if (plan.generatedPlan && (plan.generatedPlan as any).mealPlan) {
                totalMeals = (plan.generatedPlan as any).mealPlan.reduce((acc: number, day: any) => {
                  const hasBreakfast = day.breakfast && day.breakfast.trim() !== '';
                  const hasLunch = day.lunch && day.lunch.trim() !== '' && day.lunch.trim().toLowerCase() !== 'skip' && day.lunch.trim().toLowerCase() !== 'none';
                  const hasDinner = day.dinner && day.dinner.trim() !== '';
                  return acc + (hasBreakfast ? 1 : 0) + (hasLunch ? 1 : 0) + (hasDinner ? 1 : 0);
                }, 0);
              }

              return (`;

content = content.replace(/              const ingredientList = plan\.ingredients[\s\S]*?\.filter\(\(i: string\) => i\.length > 0\);\s*return \(/, replacement1);

const replacement2 = `                        <Utensils className="w-3 h-3 text-[var(--color-secondary)]" />
                        <span className="text-[0.6875rem] font-bold text-[var(--color-secondary)]">
                          {totalMeals} Meals
                        </span>`;

content = content.replace(/                        <Utensils className="w-3 h-3 text-\[var\(--color-secondary\)\]" \/>\s*<span className="text-\[0\.6875rem\] font-bold text-\[var\(--color-secondary\)\]\">\s*21 Meals\s*<\/span>/, replacement2);

fs.writeFileSync('components/dashboard/SavedPlansTab.tsx', content);
console.log('done');

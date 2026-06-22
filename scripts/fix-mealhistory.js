const fs = require('fs');
let content = fs.readFileSync('components/dashboard/MealHistoryTab.tsx', 'utf8');

const replacement1 = `                      {plans.map((plan: MealPlanModel, idx: number) => {
                        const planDate = new Date(plan.createdAt);
                        const compactDate = planDate.toLocaleDateString('en-US', { weekday: 'short' });
                        const time = planDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

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

content = content.replace(/                      \{plans\.map\(\(plan: MealPlanModel, idx: number\) => \{\s*const planDate = new Date\(plan\.createdAt\);\s*const compactDate = planDate\.toLocaleDateString\('en-US', \{ weekday: 'short' \}\);\s*const time = planDate\.toLocaleTimeString\('en-US', \{ hour: 'numeric', minute: '2-digit' \}\);\s*return \(/, replacement1);

const replacement2 = `                              {/* Compact 7 Days • {totalMeals} Meals */}
                              <div className="text-[0.7rem] font-medium text-[var(--color-secondary)]">
                                7 Days&nbsp;•&nbsp;{totalMeals} Meals
                              </div>`;

content = content.replace(/                              \{\/\* Compact 7 Days • 21 Meals \*\/\}\s*<div className="text-\[0\.7rem\] font-medium text-\[var\(--color-secondary\)\]\">\s*7 Days&nbsp;•&nbsp;21 Meals\s*<\/div>/, replacement2);

fs.writeFileSync('components/dashboard/MealHistoryTab.tsx', content);
console.log('done');

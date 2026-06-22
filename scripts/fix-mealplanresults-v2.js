const fs = require('fs');
let content = fs.readFileSync('components/meal-plans/MealPlanResults.tsx', 'utf8');

const totalMealsLogic = `  const availableIngredients = ingredients
    .split(',')
    .map(i => i.trim())
    .filter(i => i.length > 0);

  const totalMeals = plan.mealPlan.reduce((acc, day) => {
    const hasBreakfast = day.breakfast && day.breakfast.trim() !== '';
    const hasLunch = day.lunch && day.lunch.trim() !== '' && day.lunch.trim().toLowerCase() !== 'skip' && day.lunch.trim().toLowerCase() !== 'none';
    const hasDinner = day.dinner && day.dinner.trim() !== '';
    return acc + (hasBreakfast ? 1 : 0) + (hasLunch ? 1 : 0) + (hasDinner ? 1 : 0);
  }, 0);
  const totalDays = plan.mealPlan.length;`;

content = content.replace(/  const availableIngredients = ingredients[\s\S]*?\.filter\(i => i\.length > 0\);/, totalMealsLogic);

content = content.replace('7 Days (21 Meals)', '{totalDays} Days ({totalMeals} Meals)');

const replacement3 = `                  <div className={\`grid grid-cols-1 sm:grid-cols-\${dayPlan.lunch && dayPlan.lunch.trim() !== '' && dayPlan.lunch.trim().toLowerCase() !== 'skip' && dayPlan.lunch.trim().toLowerCase() !== 'none' ? '3' : '2'} gap-4 sm:gap-6\`}>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[var(--color-secondary)]">
                        <Coffee className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Breakfast</span>
                      </div>
                      <p className="text-[0.875rem] font-medium text-[var(--color-on-surface)]">{dayPlan.breakfast}</p>
                    </div>
                    
                    {dayPlan.lunch && dayPlan.lunch.trim() !== '' && dayPlan.lunch.trim().toLowerCase() !== 'skip' && dayPlan.lunch.trim().toLowerCase() !== 'none' && (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[var(--color-secondary)]">
                          <Sun className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-widest">Lunch</span>
                        </div>
                        <p className="text-[0.875rem] font-medium text-[var(--color-on-surface)]">{dayPlan.lunch}</p>
                      </div>
                    )}
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[var(--color-secondary)]">
                        <Utensils className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Dinner</span>
                      </div>
                      <p className="text-[0.875rem] font-medium text-[var(--color-on-surface)]">{dayPlan.dinner}</p>
                    </div>
                  </div>`;

content = content.replace(/                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">[\s\S]*?                  <\/div>\n                  \n                  \{\/\* Card Footer AI Reasoning \*\/\}/, replacement3 + '\n                  \n                  {/* Card Footer AI Reasoning */}');

fs.writeFileSync('components/meal-plans/MealPlanResults.tsx', content);
console.log('done');

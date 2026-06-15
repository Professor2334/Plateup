export interface ShoppingListEntry {
  item: string;
  quantity: string;
}

export interface MealPlanDay {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  primaryIngredientsUsed: string[];
}

export interface ConsumptionRule {
  keywords: string[];
  portionSize: number; // Consumption unit per person per meal
  conversion: (totalPortions: number) => string;
}

// Rules for calculating realistic shopping quantities based on household size and meal frequency
const CONSUMPTION_RULES: ConsumptionRule[] = [
  {
    keywords: ['bread'],
    portionSize: 4, // 4 slices per person
    conversion: (totalSlices) => {
      // 1 standard Nigerian sliced loaf = ~14-16 usable slices
      const loaves = Math.ceil(totalSlices / 14);
      return `${loaves} ${loaves === 1 ? 'loaf' : 'loaves'}`;
    }
  },
  {
    keywords: ['egg'],
    portionSize: 2, // 2 eggs per person
    conversion: (totalEggs) => {
      if (totalEggs >= 24) return `${Math.ceil(totalEggs / 30)} crate(s) (30 pieces each)`;
      return `${Math.ceil(totalEggs)} pieces`;
    }
  },
  {
    keywords: ['yam'],
    portionSize: 0.25, // 1/4 of a medium tuber per person
    conversion: (totalTubers) => {
      const tubers = Math.ceil(totalTubers);
      return `${tubers} medium ${tubers === 1 ? 'tuber' : 'tubers'}`;
    }
  },
  {
    keywords: ['plantain'],
    portionSize: 1.5, // 1.5 fingers per person
    conversion: (totalFingers) => {
      const bunches = Math.ceil(totalFingers / 6); // ~6 fingers per bunch
      return `${bunches} ${bunches === 1 ? 'bunch' : 'bunches'}`;
    }
  },
  {
    keywords: ['rice'],
    portionSize: 1.25, // 1.25 cups per person
    conversion: (totalCups) => {
      const dericas = Math.ceil(totalCups / 3.5); // 1 De-rica = ~3.5 cups
      if (dericas >= 6) return `${Math.ceil(dericas / 6)} paint rubber(s)`;
      return `${dericas} ${dericas === 1 ? 'De-rica' : 'De-ricas'}`;
    }
  },
  {
    keywords: ['beans'],
    portionSize: 1.5, // 1.5 cups per person (expands, but often eaten heavily)
    conversion: (totalCups) => {
      const dericas = Math.ceil(totalCups / 3.5);
      if (dericas >= 6) return `${Math.ceil(dericas / 6)} paint rubber(s)`;
      return `${dericas} ${dericas === 1 ? 'De-rica' : 'De-ricas'}`;
    }
  },
  {
    keywords: ['garri'],
    portionSize: 1.5, // 1.5 cups per person (for eba or drinking)
    conversion: (totalCups) => {
      const dericas = Math.ceil(totalCups / 3.5);
      if (dericas >= 6) return `${Math.ceil(dericas / 6)} paint rubber(s)`;
      return `${dericas} ${dericas === 1 ? 'De-rica' : 'De-ricas'}`;
    }
  },
  {
    keywords: ['chicken', 'turkey', 'beef', 'meat', 'minced meat'],
    portionSize: 2, // 2 pieces per person
    conversion: (totalPieces) => {
      // roughly 10-12 pieces per kg depending on cut
      const kg = Math.max(1, Math.ceil(totalPieces / 10));
      return `${kg}kg`;
    }
  },
  {
    keywords: ['liver'],
    portionSize: 0.1, // 100g per person per meal
    conversion: (totalKg) => {
      const kg = Math.max(0.2, Math.ceil(totalKg * 10) / 10);
      return `${kg}kg`;
    }
  },
  {
    keywords: ['fish', 'mackerel', 'titus'],
    portionSize: 1, // 1 medium piece per person
    conversion: (totalPieces) => {
      return `${Math.ceil(totalPieces)} medium ${totalPieces === 1 ? 'piece' : 'pieces'}`;
    }
  },
  {
    keywords: ['tomato', 'tomatoes'],
    portionSize: 0.1, // 100g per person per meal
    conversion: (totalKg) => {
      const kg = Math.ceil(totalKg * 10) / 10;
      if (kg <= 0.5) return `₦500 worth`;
      if (kg <= 1) return `₦1,000 worth (small bowl)`;
      return `${Math.ceil(kg)}kg`;
    }
  },
  {
    keywords: ['onion', 'onions'],
    portionSize: 0.05, // 50g per person per meal
    conversion: (totalKg) => {
      const kg = Math.ceil(totalKg * 10) / 10;
      if (kg <= 0.5) return `₦500 worth`;
      return `₦1,000 worth (small bowl)`;
    }
  },
  {
    keywords: ['pepper', 'tatashe', 'habanero', 'atarodo'],
    portionSize: 0.015, // 15g per person per meal (very spicy)
    conversion: (totalKg) => {
      const kg = Math.ceil(totalKg * 100) / 100; // Round to 2 decimals
      if (kg <= 0.2) return `₦200 worth`;
      if (kg <= 0.5) return `₦500 worth`;
      return `₦1,000 worth (small bowl)`;
    }
  },
  {
    keywords: ['palm oil', 'groundnut oil', 'vegetable oil'],
    portionSize: 0.05, // 50ml per person per meal
    conversion: (totalLiters) => {
      if (totalLiters <= 0.5) return `50cl bottle`;
      if (totalLiters <= 1) return `1L bottle`;
      return `${Math.ceil(totalLiters)}L`;
    }
  },
  {
    keywords: ['milk'],
    portionSize: 1, // 1 sachet per person per meal
    conversion: (totalSachets) => {
      if (totalSachets <= 5) return `${Math.ceil(totalSachets)} small sachets`;
      if (totalSachets <= 10) return `1 roll of small sachets`;
      return `1 medium tin/pack (e.g. 380g)`;
    }
  },
  {
    keywords: ['milo', 'cocoa', 'tea', 'coffee'],
    portionSize: 1, // 1 sachet/bag per person per meal
    conversion: (totalUnits) => {
      if (totalUnits <= 5) return `${Math.ceil(totalUnits)} sachets/bags`;
      if (totalUnits <= 10) return `1 small box/pack`;
      return `1 medium tin/pack (e.g. 400g)`;
    }
  },
  {
    keywords: ['sugar'],
    portionSize: 2, // 2 teaspoons per person per meal
    conversion: (totalTeaspoons) => {
      if (totalTeaspoons <= 20) return `1 small sachet (e.g. 50g)`;
      return `1 small pack (e.g. 250g)`;
    }
  },
  {
    keywords: ['pap', 'ogi', 'akamu'],
    portionSize: 1, // 1 wrap per person per meal
    conversion: (totalWraps) => {
      if (totalWraps <= 4) return `₦200 worth (wet wraps)`;
      if (totalWraps <= 10) return `₦500 worth (wet wraps)`;
      return `1 small paint rubber (wet)`;
    }
  }
];

export function validateShoppingQuantities(
  shoppingList: ShoppingListEntry[],
  mealPlan: MealPlanDay[],
  householdMultiplier: number
): void {
  shoppingList.forEach(entry => {
    const itemLower = entry.item.toLowerCase();
    
    // Find matching rule
    const rule = CONSUMPTION_RULES.find(r => r.keywords.some(k => itemLower.includes(k)));
    
    // If we have a rule, we must calculate frequency
    if (rule) {
      // Find what the AI called it to accurately count occurrences
      const targetKeyword = rule.keywords.find(k => itemLower.includes(k)) || itemLower;
      
      let frequency = 0;
      mealPlan.forEach(day => {
        const mealsText = `${day.breakfast} ${day.lunch} ${day.dinner}`.toLowerCase();
        if (mealsText.includes(targetKeyword)) {
          frequency++;
        } else {
          const found = day.primaryIngredientsUsed.some(ing => {
            const ingLower = ing.toLowerCase();
            return ingLower.includes(targetKeyword) || targetKeyword.includes(ingLower);
          });
          if (found) frequency++;
        }
      });

      if (frequency > 0) {
        // Apply formula: Frequency * Household Size * Portion Size
        const totalConsumption = frequency * householdMultiplier * rule.portionSize;
        entry.quantity = rule.conversion(totalConsumption);
      }
    }
  });
}

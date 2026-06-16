import { ShoppingItem } from '@/types';
import { PRICE_FLOORS, TRIVIAL_ITEMS } from './constants';

export function fuzzyDeduplicateShoppingList(shoppingList: ShoppingItem[]): ShoppingItem[] {
  const deduplicated = new Map<string, string>();
  
  const normalizeItem = (item: string) => {
    return item.toLowerCase()
      .replace(/\b(fresh|raw|dry|dried|tin|canned|frozen|bunch|pieces|medium|large|small)\b/g, '')
      .replace(/ies\b/, 'y')
      .replace(/s\b/, '')
      .trim();
  };

  for (const entry of shoppingList) {
      const originalLower = entry.item.toLowerCase().trim();
      if (originalLower.length === 0) continue;
      
      const normalized = normalizeItem(originalLower);
      
      // Substring matching to catch "Tomato" vs "Fresh Tomatoes"
      let matchedKey = null;
      for (const key of Array.from(deduplicated.keys())) {
        if (key.includes(normalized) || normalized.includes(key)) {
          matchedKey = key;
          // Keep the shorter/broader key as the root
          if (normalized.length < key.length && normalized.length > 2) {
            matchedKey = normalized;
            const oldVal = deduplicated.get(key)!;
            deduplicated.delete(key);
            deduplicated.set(matchedKey, oldVal);
          }
          break;
        }
      }

      if (matchedKey) {
        deduplicated.set(matchedKey, `${deduplicated.get(matchedKey)} + ${entry.quantity}`);
      } else {
        deduplicated.set(normalized, entry.quantity);
      }
  }
  
  return Array.from(deduplicated.entries()).map(([item, quantity]) => ({
      item: item.charAt(0).toUpperCase() + item.slice(1), 
      quantity
  }));
}

export function getFloorPrice(item: string): number {
  const lower = item.toLowerCase();
  if (TRIVIAL_ITEMS.some(i => lower.includes(i))) return 0;
  
  for (const [key, price] of Object.entries(PRICE_FLOORS)) {
    if (lower.includes(key)) return price;
  }
  return 600; // default floor for unrecognized small items in 2026
}

export function calculateSafeEstimatedCost(shoppingList: ShoppingItem[], aiEstimatedCost: number): number {
  const minRealisticCost = shoppingList.reduce((total: number, entry: ShoppingItem) => total + getFloorPrice(entry.item), 0);
  return Math.max(minRealisticCost, aiEstimatedCost);
}

export function filterTrivialShoppingItems(shoppingList: ShoppingItem[]): ShoppingItem[] {
  return shoppingList.filter((entry: ShoppingItem) => {
    const lower = entry.item.toLowerCase();
    if (/(leftover|remaining|extra|previous meal)/.test(lower)) return false;
    if (TRIVIAL_ITEMS.some(i => lower.includes(i))) return false;
    return true;
  });
}

const DEFAULT_FALLBACK_QUANTITIES: Record<string, string> = {
  yam: "2 medium tubers",
  "palm oil": "50cl bottle",
  "groundnut oil": "1L bottle",
  "vegetable oil": "1L bottle",
  crayfish: "1 cup",
  plantain: "1 bunch",
  rice: "1 De-rica",
  beans: "1 De-rica",
  garri: "1 De-rica",
  bread: "1 loaf",
  milk: "1 tin"
};

const CATEGORIES = {
  spice: ['curry', 'thyme', 'seasoning', 'maggi', 'knorr', 'salt', 'pepper', 'ginger', 'garlic', 'locust bean', 'iru', 'ogiri', 'dawadawa', 'spice'],
  produce: ['tomato', 'onion', 'vegetable', 'leaf', 'spinach', 'ugu', 'waterleaf', 'bitterleaf', 'ewedu', 'okra', 'okro', 'carrot', 'cabbage', 'cucumber', 'lemon', 'lime', 'potato'],
  protein: ['chicken', 'beef', 'meat', 'fish', 'turkey', 'snail', 'ponmo', 'cow leg', 'goat', 'pork', 'egg', 'shrimp', 'prawn'],
  packaged: ['oil', 'paste', 'spaghetti', 'macaroni', 'pasta', 'noodle', 'indomie', 'flour', 'semovita', 'wheat', 'poundo', 'sugar', 'butter', 'margarine', 'mayonnaise']
};

/**
 * Returns a standardized, scalable quantity for any auto-added fallback ingredient.
 * Ensures the shopping list never contains unmeasurable values like "As needed".
 */
export function getFallbackQuantity(ingredientName: string): string {
  if (!ingredientName) return "1 standard pack";
  
  const lowerName = ingredientName.toLowerCase().trim();

  // 1. Check direct specific mapping
  for (const [key, qty] of Object.entries(DEFAULT_FALLBACK_QUANTITIES)) {
    if (lowerName.includes(key)) {
      return qty;
    }
  }

  // 2. Check categories for dynamic mapping
  if (CATEGORIES.spice.some(k => lowerName.includes(k))) return "1 sachet";
  if (CATEGORIES.produce.some(k => lowerName.includes(k))) return "1 unit";
  if (CATEGORIES.protein.some(k => lowerName.includes(k))) return "1 piece";
  if (CATEGORIES.packaged.some(k => lowerName.includes(k))) return "1 pack";

  // 3. Absolute universal default
  return "1 standard pack";
}

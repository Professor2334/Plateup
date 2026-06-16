export const BASE_PORTION_COST = 450;
export const REDUCTION_PER_ITEM = 25; // ₦25 reduction per pantry item
export const FLOOR_PORTION_COST = 200; // ₦200 floor portion cost

export const PRICE_FLOORS: Record<string, number> = {
  rice: 2000, beans: 1500, garri: 800, yam: 4000, plantain: 1000,
  bread: 1500, semolina: 2000, potato: 2000,
  chicken: 5500, beef: 7500, eggs: 2000, fish: 2500, stockfish: 3000,
  mackerel: 2000, sardines: 1500,
  tomatoes: 2000, onions: 1500, pepper: 1500, habanero: 1200,
  vegetables: 1000, okra: 1000, coconut: 1000,
  egusi: 3000, ogbono: 3000, crayfish: 2000,
  'palm oil': 2000, 'groundnut oil': 2500, seasoning: 600,
};

export const TRIVIAL_ITEMS = [
  'water', 'salt', 'maggi', 'seasoning cube', 'curry', 
  'thyme', 'garlic', 'ginger', 'knorr', 'bouillon'
];

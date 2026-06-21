const FORBIDDEN_PREFIXES = [
  'Fresh',
  'Homemade',
  'Delicious',
  'Special',
  'Tasty'
];

/**
 * Normalizes a meal name by removing forbidden artificial prefixes
 * and cleaning up whitespace.
 * e.g., "Fresh Jollof Rice" -> "Jollof Rice"
 */
export function normalizeMealName(mealName: string): string {
  if (!mealName) return mealName;
  
  let cleaned = mealName.trim();
  
  // Create a regex to match the forbidden prefixes at the start of the string, case insensitive
  // \b ensures we only match whole words
  const prefixRegex = new RegExp(`^\\b(${FORBIDDEN_PREFIXES.join('|')})\\b\\s*`, 'i');
  
  // Use a while loop to catch stacked prefixes (e.g., "Fresh Tasty Jollof Rice")
  while (prefixRegex.test(cleaned)) {
    cleaned = cleaned.replace(prefixRegex, '').trim();
  }
  
  return cleaned;
}

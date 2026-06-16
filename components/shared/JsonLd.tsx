/**
 * JsonLd — Reusable JSON-LD Structured Data component.
 * Renders a <script type="application/ld+json"> tag server-side
 * for Google rich result eligibility.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Pre-built schema for PlateUp as a WebApplication */
export const plateUpWebAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PlateUp',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://plateup.app',
  description:
    'AI-powered Nigerian meal planning platform that helps households create budget-friendly weekly meal plans using available ingredients and spending limits.',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Web',
  inLanguage: 'en-NG',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'NGN',
  },
  audience: {
    '@type': 'Audience',
    geographicArea: {
      '@type': 'Country',
      name: 'Nigeria',
    },
    audienceType: 'Nigerian households, students, families, working professionals',
  },
  featureList: [
    'AI-generated 7-day Nigerian meal plans',
    'Budget-aware meal planning',
    'Pantry ingredient utilization',
    'Smart shopping list generation',
    'Meal history and plan reuse',
    'WhatsApp meal plan sharing',
  ],
  brand: {
    '@type': 'Brand',
    name: 'PlateUp',
  },
  creator: {
    '@type': 'Organization',
    name: 'PlateUp',
  },
};

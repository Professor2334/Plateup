import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://plateup.com.ng';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/privacy',
          '/terms',
          '/contact',
          '/nigerian-meal-planner',
          '/budget-meal-planner-nigeria',
          '/meal-planning-for-students',
          '/weekly-food-budget-guide',
          '/how-to-plan-meals-on-a-budget',
          '/blog',
        ],
        // Block all private, authenticated, and non-indexable paths
        disallow: [
          '/auth/',
          '/dashboard/',
          '/api/',
          '/admin/',
          '/test-typography/',
          '/fonts/',
        ],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
    host: APP_URL,
  };
}

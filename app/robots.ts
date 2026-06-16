import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://plateup.app';

  return {
    rules: [
      {
        // Allow all major search engine crawlers
        userAgent: '*',
        allow: [
          '/',
          '/privacy',
          '/terms',
          '/contact',
          '/auth/login',
          '/auth/register',
        ],
        disallow: [
          '/dashboard',
          '/api/',
          '/auth/verify-email',
          '/auth/forgot-password',
          '/auth/reset-password',
          '/test-typography',
        ],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
    host: APP_URL,
  };
}

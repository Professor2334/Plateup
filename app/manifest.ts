import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PlateUp — AI Meal Planning for Nigerian Households',
    short_name: 'PlateUp',
    description:
      'AI-powered Nigerian meal planning platform. Generate a 7-day budget-aware meal plan and shopping list in under 60 seconds.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: 'hsl(142, 72%, 29%)',
    orientation: 'portrait-primary',
    categories: ['food', 'lifestyle', 'productivity'],
    lang: 'en-NG',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}

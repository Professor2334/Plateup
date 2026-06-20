import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://plateup.com.ng';
  const now = new Date();

  const sitemap: MetadataRoute.Sitemap = [
    {
      url: APP_URL,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${APP_URL}/auth/login`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${APP_URL}/auth/register`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
  ];

  // Auto-discover top-level pages
  const excludeDirs = ['api', 'auth', 'dashboard', 'fonts', 'test-typography'];
  const basePriority = 0.8;

  try {
    const appDir = path.join(process.cwd(), 'app');
    const items = fs.readdirSync(appDir, { withFileTypes: true });

    for (const item of items) {
      if (item.isDirectory()) {
        const dirName = item.name;
        // Skip ignored directories, route groups, or private folders
        if (
          excludeDirs.includes(dirName) ||
          dirName.startsWith('(') ||
          dirName.startsWith('_')
        ) {
          continue;
        }

        const pagePath = path.join(appDir, dirName, 'page.tsx');
        if (fs.existsSync(pagePath)) {
          // Dynamic priority based on route type
          let priority = basePriority;
          if (['privacy', 'terms', 'contact'].includes(dirName)) {
            priority = 0.3; // legal/contact pages
          }

          sitemap.push({
            url: `${APP_URL}/${dirName}`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority,
          });
        }
      }
    }

    // Force include /blog if it wasn't caught (e.g. if it doesn't exist yet)
    if (!sitemap.some(route => route.url === `${APP_URL}/blog`)) {
      sitemap.push({
        url: `${APP_URL}/blog`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }

  } catch (error) {
    console.error('Failed to auto-discover sitemap routes:', error);
    // Hardcoded fallback
    const fallbackRoutes = [
      'privacy', 'terms', 'contact', 'nigerian-meal-planner',
      'meal-planning-for-students', 'weekly-food-budget-guide',
      'how-to-plan-meals-on-a-budget', 'budget-meal-planner-nigeria', 'blog'
    ];
    
    fallbackRoutes.forEach(route => {
      if (!sitemap.some(r => r.url === `${APP_URL}/${route}`)) {
        sitemap.push({
          url: `${APP_URL}/${route}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    });
  }

  return sitemap;
}

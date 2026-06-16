/**
 * Landing page — Server Component wrapper.
 *
 * This thin server wrapper exists to inject JSON-LD structured data and
 * page-level metadata before handing rendering to the client component.
 * The actual interactive UI lives in LandingPageClient.tsx.
 */
import type { Metadata } from 'next';
import { JsonLd, plateUpWebAppSchema } from '@/components/shared/JsonLd';
import LandingPageClient from './LandingPageClient';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={plateUpWebAppSchema} />
      <LandingPageClient />
    </>
  );
}

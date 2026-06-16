import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://plateup.app";

export const viewport: Viewport = {
  themeColor: "hsl(142, 72%, 29%)",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  title: {
    default: "PlateUp | AI Meal Planning for Nigerian Households",
    template: "%s | PlateUp",
  },

  description:
    "AI-powered Nigerian meal planning platform that helps households create budget-friendly weekly meal plans using available ingredients and spending limits.",

  keywords: [
    "Nigerian meal planner",
    "AI meal planning",
    "Weekly meal planner Nigeria",
    "Budget meal planner",
    "Pantry meal planning",
    "Shopping list generator",
    "Nigerian food budgeting",
    "Meal planning app Nigeria",
    "Family meal planner",
    "Household budget meals",
  ],

  authors: [{ name: "PlateUp" }],
  creator: "PlateUp",
  publisher: "PlateUp",
  category: "Food & Drink",
  applicationName: "PlateUp",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_NG",
    url: APP_URL,
    siteName: "PlateUp",
    title: "PlateUp | AI Meal Planning for Nigerian Households",
    description:
      "AI-powered Nigerian meal planning platform that helps households create budget-friendly weekly meal plans using available ingredients and spending limits.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PlateUp — AI Meal Planning for Nigerian Households",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "PlateUp | AI Meal Planning for Nigerian Households",
    description:
      "Generate a complete 7-day Nigerian meal plan and shopping list in under 60 seconds. Budget-aware, ingredient-smart.",
    images: ["/og-image.png"],
    creator: "@plateupapp",
    site: "@plateupapp",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [{ url: "/plateup-logo.svg", type: "image/svg+xml" }],
    shortcut: "/plateup-logo.svg",
    apple: "/plateup-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-NG">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}

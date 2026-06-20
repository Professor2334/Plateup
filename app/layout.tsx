import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://plateup.com.ng";

export const viewport: Viewport = {
  themeColor: "hsl(142, 72%, 29%)",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  title: {
    default: "PlateUp - AI Meal Planner for Nigerian Families",
    template: "%s | PlateUp",
  },

  description:
    "Generate affordable Nigerian meal plans using AI. Plan weekly meals based on your budget, pantry ingredients, and household size.",

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
  verification: {
    google: "A-tLQyiuxgnHPCNuKw_s8obNpqWlHk2YmTymBCbS9Dg",
  },

  openGraph: {
    type: "website",
    locale: "en_NG",
    url: APP_URL,
    siteName: "PlateUp",
    title: "PlateUp - AI Meal Planner for Nigerian Families",
    description:
      "Generate affordable Nigerian meal plans using AI. Plan weekly meals based on your budget, pantry ingredients, and household size.",
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
    title: "PlateUp - AI Meal Planner for Nigerian Families",
    description:
      "Generate affordable Nigerian meal plans using AI. Plan weekly meals based on your budget, pantry ingredients, and household size.",
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
    icon: [{ url: "/plateup-logo.png", type: "image/png" }],
    shortcut: "/plateup-logo.png",
    apple: "/plateup-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-NG">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster position="top-right" duration={5000} richColors closeButton />
      </body>
    </html>
  );
}

import {
  defaultLocale,
  isLocaleSegment,
  localeCookie,
  toLanguageTag,
} from "@/app/i18n/settings";
import { siteMetadata } from "@/lib/site-metadata";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import type { ReactNode } from "react";
import "./globals.css";

const backgrounds: Record<number, string> = {
  1: "before:bg-(image:--bg-image,url('/assets/backgrounds/bg1.webp'))",
  2: "before:bg-(image:--bg-image,url('/assets/backgrounds/bg2.webp'))",
  3: "before:bg-(image:--bg-image,url('/assets/backgrounds/bg3.webp'))",
  4: "before:bg-(image:--bg-image,url('/assets/backgrounds/bg4.webp'))",
  5: "before:bg-(image:--bg-image,url('/assets/backgrounds/bg5.webp'))",
  6: "before:bg-(image:--bg-image,url('/assets/backgrounds/bg6.webp'))",
};

const defaultLocaleTag = toLanguageTag(defaultLocale);
const ogLocale = defaultLocaleTag.replace("-", "_");

export const viewport = {
  themeColor: "#0A0F1C",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.url),
  title: {
    default: siteMetadata.name,
    template: `%s | ${siteMetadata.name}`,
  },
  description: siteMetadata.shortDescription,
  keywords: siteMetadata.keywords,
  authors: [{ name: "Jonas Antunes" }],
  creator: "Jonas Antunes",
  publisher: "Jonas Antunes",
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "msapplication-TileColor": "#0A0F1C",
    googlebot:
      "index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1",
    "apple-mobile-web-app-capable": "yes",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteMetadata.name,
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: siteMetadata.name,
    title: `${siteMetadata.name} - Riftbound Card Price Comparison`,
    description:
      "Find and compare Riftbound card prices across multiple stores. Built for Riftbound players.",
    url: siteMetadata.url,
    locale: ogLocale,
    images: [
      {
        url: siteMetadata.ogImage,
        width: siteMetadata.ogImageWidth,
        height: siteMetadata.ogImageHeight,
        alt: `${siteMetadata.name} preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@hextechindex",
    title: `${siteMetadata.name} - Riftbound Card Prices`,
    description:
      "Compare Riftbound card prices across stores. Find the best deals on Hextech Index.",
    images: [
      {
        url: siteMetadata.ogImage,
        alt: `${siteMetadata.name} preview`,
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headerStore = await headers();
  const headerLocale = headerStore.get("x-locale");
  const cookieStore = await cookies();
  const storedLocale = cookieStore.get(localeCookie)?.value;
  const locale = isLocaleSegment(headerLocale)
    ? headerLocale
    : isLocaleSegment(storedLocale)
    ? storedLocale
    : defaultLocale;
  const languageTag = toLanguageTag(locale);

  const background =
    backgrounds[
      Math.floor(Math.random() * Object.keys(backgrounds).length) + 1
    ];

  return (
    <html lang={languageTag}>
      <body
        className={cn(
          background,
          "flex flex-col justify-start items-center min-h-screen overflow-x-hidden [font-family:var(--font-ui)]",
          "before:z-[-2] before:fixed before:inset-0 before:content-[''] before:pointer-events-none",
          "before:bg-cover before:bg-no-repeat before:bg-center before:opacity-[0.92]",
          "before:filter-[brightness(0.92)_contrast(1.12)_saturate(0.9)]",
          "after:z-[-1] after:fixed after:inset-0 after:content-[''] after:pointer-events-none",
          "after:bg-[linear-gradient(rgba(10,15,28,0.19),rgba(10,15,28,0.31)),linear-gradient(180deg,var(--bg-overlay)_0%,var(--bg)_60%)]",
          "after:[background-blend-mode:multiply,normal]"
        )}
      >
        {children}
      </body>
    </html>
  );
}

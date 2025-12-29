import {
  defaultLocale,
  isLocaleSegment,
  localeCookie,
  toLanguageTag,
} from "@/app/i18n/settings";
import { siteMetadata } from "@/lib/site-metadata";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import type { ReactNode } from "react";
import "./globals.css";

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

  return (
    <html lang={languageTag}>
      <body>{children}</body>
    </html>
  );
}

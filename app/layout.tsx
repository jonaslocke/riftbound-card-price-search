import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import GlobalHeader from "./components/GlobalHeader";
import { siteMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.url),
  title: {
    default: siteMetadata.name,
    template: `%s | ${siteMetadata.name}`,
  },
  description: siteMetadata.shortDescription,
  keywords: siteMetadata.keywords,
  manifest: "/site.webmanifest",
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
      "Find and compare Riftbound card prices across multiple stores. Built for Runeterra players.",
    url: siteMetadata.url,
    images: [siteMetadata.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteMetadata.name} - Riftbound Card Prices`,
    description:
      "Compare Riftbound card prices across stores. Find the best deals on Hextech Codex.",
    images: [siteMetadata.ogImage],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GlobalHeader />
        {children}
      </body>
    </html>
  );
}

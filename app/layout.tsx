import { getLanguageTag } from "@/lib/getLanguageTag";
import { createHextechMetadata } from "@/lib/metadata/create-hextech-metadata";
import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import AppProviders from "./components/AppProviders";
import GlobalHeader from "./components/GlobalHeader";
import LayoutChrome from "./components/LayoutChrome";
import SiteFooter from "./components/SiteFooter";
import "./globals.css";
import {
  defaultLocale,
  isLocaleSegment,
  type LocaleSegment,
} from "./i18n/settings";

export const viewport = {
  themeColor: "#0A0F1C",
};

export async function generateMetadata(): Promise<Metadata> {
  return createHextechMetadata();
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale?: string }> | { locale?: string };
}) {
  const languageTag = await getLanguageTag();
  const resolvedParams = await Promise.resolve(params);
  const localeParam = resolvedParams?.locale;
  const locale: LocaleSegment = isLocaleSegment(localeParam)
    ? localeParam
    : defaultLocale;

  return (
    <html lang={languageTag}>
      <body
        style={
          {
            "--background-image": "url('/assets/backgrounds/bg1.webp')",
          } as CSSProperties
        }
      >
        <AppProviders locale={locale}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}

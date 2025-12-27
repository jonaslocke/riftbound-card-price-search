import type { ReactNode } from "react";
import GlobalHeader from "../components/GlobalHeader";
import I18nClientProvider from "../i18n/ClientProvider";
import {
  defaultLocale,
  isLocaleSegment,
  type LocaleSegment,
} from "../i18n/settings";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale?: string }> | { locale?: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const localeParam = resolvedParams?.locale;
  const locale: LocaleSegment = isLocaleSegment(localeParam)
    ? localeParam
    : defaultLocale;

  return (
    <I18nClientProvider locale={locale}>
      <GlobalHeader />
      {children}
    </I18nClientProvider>
  );
}

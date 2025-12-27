"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import I18nClientProvider from "../i18n/ClientProvider";
import type { LocaleSegment } from "../i18n/settings";

export default function AppProviders({
  locale,
  children,
}: {
  locale: LocaleSegment;
  children: ReactNode;
}) {
  return (
    <SessionProvider>
      <I18nClientProvider locale={locale}>{children}</I18nClientProvider>
    </SessionProvider>
  );
}

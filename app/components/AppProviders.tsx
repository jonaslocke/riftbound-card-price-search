"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import I18nClientProvider from "../i18n/ClientProvider";
import { I18nHelpersProvider } from "../i18n/HelpersProvider";
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
      <I18nClientProvider locale={locale}>
        <I18nHelpersProvider>{children}</I18nHelpersProvider>
      </I18nClientProvider>
    </SessionProvider>
  );
}

"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { initI18n } from "./client";
import { toLanguageTag, type LocaleSegment } from "./settings";

export default function I18nClientProvider({
  locale,
  children,
}: {
  locale: LocaleSegment;
  children: ReactNode;
}) {
  const [i18n] = useState(() => initI18n(locale));

  useEffect(() => {
    i18n.changeLanguage(toLanguageTag(locale));
  }, [i18n, locale]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

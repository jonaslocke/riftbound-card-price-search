"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

type I18nHelpers = {
  t: TFunction;
  language: string;
  defaultCurrency: string;
};

const I18nHelpersContext = createContext<I18nHelpers | null>(null);

const getDefaultCurrency = (language: string) => {
  const normalized = language.toLowerCase();
  if (normalized.startsWith("pt-br")) return "BRL";
  if (normalized.endsWith("-br")) return "BRL";
  return "USD";
};

export function I18nHelpersProvider({ children }: { children: ReactNode }) {
  const { t, i18n } = useTranslation("common");
  const language = i18n.resolvedLanguage ?? i18n.language;

  const helpers = useMemo<I18nHelpers>(() => {
    return {
      t,
      language,
      defaultCurrency: getDefaultCurrency(language),
    };
  }, [language, t]);

  return (
    <I18nHelpersContext.Provider value={helpers}>
      {children}
    </I18nHelpersContext.Provider>
  );
}

export function useI18nHelpers(options?: {
  numberFormatOptions?: Intl.NumberFormatOptions;
}) {
  const context = useContext(I18nHelpersContext);
  if (!context) {
    throw new Error("useI18nHelpers must be used within I18nHelpersProvider");
  }

  const defaultOptions = useMemo<Intl.NumberFormatOptions>(
    () => ({
      style: "currency",
      currency: context.defaultCurrency,
      ...options?.numberFormatOptions,
    }),
    [context.defaultCurrency, options?.numberFormatOptions]
  );

  return {
    t: context.t,
    numberFormatter: (overrides?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat(context.language, {
        ...defaultOptions,
        ...overrides,
      }),
  };
}

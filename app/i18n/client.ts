import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./resources";
import {
  defaultLocale,
  namespaces,
  toLanguageTag,
  type LocaleSegment,
} from "./settings";

export function initI18n(locale: LocaleSegment) {
  if (!i18next.isInitialized) {
    i18next.use(initReactI18next).init({
      lng: toLanguageTag(locale),
      fallbackLng: toLanguageTag(defaultLocale),
      resources,
      ns: namespaces,
      defaultNS: "common",
      interpolation: { escapeValue: false },
    });
  }

  return i18next;
}

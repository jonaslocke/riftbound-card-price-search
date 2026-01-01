import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./resources";
import {
  defaultLocale,
  namespaces,
  toLanguageTag,
  type LocaleSegment,
} from "./settings";

const formatDateWithPattern = (date: Date, pattern: string) => {
  const pad2 = (value: number) => String(value).padStart(2, "0");
  const tokens: Record<string, string> = {
    DD: pad2(date.getDate()),
    MM: pad2(date.getMonth() + 1),
    YY: pad2(date.getFullYear() % 100),
    YYYY: String(date.getFullYear()),
    HH: pad2(date.getHours()),
    mm: pad2(date.getMinutes()),
  };

  return pattern.replace(/YYYY|YY|DD|MM|HH|mm/g, (token) => tokens[token]);
};

const toDate = (value: unknown) => {
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return null;
};

export function initI18n(locale: LocaleSegment) {
  if (!i18next.isInitialized) {
    i18next.use(initReactI18next).init({
      lng: toLanguageTag(locale),
      fallbackLng: toLanguageTag(defaultLocale),
      resources,
      ns: namespaces,
      defaultNS: "common",
      interpolation: {
        escapeValue: false,
        format: (value, format) => {
          if (!format) return value;
          const date = toDate(value);
          if (date) return formatDateWithPattern(date, format);
          return String(value);
        },
      },
    });
  }

  return i18next;
}

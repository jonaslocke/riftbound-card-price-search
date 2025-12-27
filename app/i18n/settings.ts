export const localeSegments = ["pt-br", "en-us"] as const;
export type LocaleSegment = (typeof localeSegments)[number];

export const defaultLocale: LocaleSegment = "pt-br";
export const localeCookie = "hextech_codex";

export const localeToLanguageTag = {
  "pt-br": "pt-BR",
  "en-us": "en-US",
} as const;

export type LanguageTag = (typeof localeToLanguageTag)[LocaleSegment];

export const languageTagToLocale: Record<LanguageTag, LocaleSegment> = {
  "pt-BR": "pt-br",
  "en-US": "en-us",
};

export const namespaces = ["common"] as const;
export type Namespace = (typeof namespaces)[number];

export function isLocaleSegment(
  value: string | null | undefined
): value is LocaleSegment {
  return Boolean(value && (localeSegments as readonly string[]).includes(value));
}

export function toLanguageTag(locale: LocaleSegment): LanguageTag {
  return localeToLanguageTag[locale];
}

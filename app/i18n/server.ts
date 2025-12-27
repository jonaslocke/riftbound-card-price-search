import { createInstance } from "i18next";
import { resources } from "./resources";
import {
  defaultLocale,
  namespaces,
  toLanguageTag,
  type LocaleSegment,
} from "./settings";

export async function getServerTranslation(locale: LocaleSegment) {
  const instance = createInstance();
  await instance.init({
    lng: toLanguageTag(locale),
    fallbackLng: toLanguageTag(defaultLocale),
    resources,
    ns: namespaces,
    defaultNS: "common",
    interpolation: { escapeValue: false },
  });

  return {
    t: instance.t.bind(instance),
  };
}

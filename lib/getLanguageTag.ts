import {
  defaultLocale,
  isLocaleSegment,
  localeCookie,
  toLanguageTag,
} from "@/app/i18n/settings";
import { cookies, headers } from "next/headers";

export const getLanguageTag = async () => {
  const headerStore = await headers();
  const headerLocale = headerStore.get("x-locale");
  const cookieStore = await cookies();
  const storedLocale = cookieStore.get(localeCookie)?.value;
  const locale = isLocaleSegment(headerLocale)
    ? headerLocale
    : isLocaleSegment(storedLocale)
    ? storedLocale
    : defaultLocale;
  return toLanguageTag(locale);
};

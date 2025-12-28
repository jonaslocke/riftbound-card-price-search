"use client";

import { useI18nHelpers } from "@/app/i18n/HelpersProvider";
import { buildLocalePath, getLocaleFromPathname } from "@/app/i18n/pathname";
import {
  defaultLocale,
  localeCookie,
  localeSegments,
  type LocaleSegment,
} from "@/app/i18n/settings";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

const localeLabels: Record<LocaleSegment, string> = {
  "pt-br": "PT-BR",
  "en-us": "EN-US",
};

export default function LanguageSwitcher() {
  const { t } = useI18nHelpers();
  const pathname = usePathname();
  const router = useRouter();
  const activeLocale = getLocaleFromPathname(pathname) ?? defaultLocale;

  const setLocale = (locale: LocaleSegment) => {
    if (locale === activeLocale) return;
    const nextPath = buildLocalePath(locale, pathname);
    document.cookie = `${localeCookie}=${locale}; path=/; max-age=31536000; samesite=lax`;
    router.push(nextPath);
  };

  return (
    <div className="inline-flex items-center gap-1 bg-white/10 p-1 border border-white/15 rounded-full text-white text-xs">
      <span className="sr-only">{t("language.switcher")}</span>
      {localeSegments.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => setLocale(locale)}
          aria-pressed={locale === activeLocale}
          className={cn(
            "px-2 py-1 rounded-full font-semibold uppercase transition",
            locale === activeLocale
              ? "bg-white text-slate-900"
              : "text-white/80 hover:text-white"
          )}
        >
          {localeLabels[locale]}
        </button>
      ))}
    </div>
  );
}

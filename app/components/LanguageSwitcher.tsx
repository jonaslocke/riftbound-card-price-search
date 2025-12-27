"use client";

import { useTranslation } from "react-i18next";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  defaultLocale,
  localeCookie,
  localeSegments,
  type LocaleSegment,
} from "@/app/i18n/settings";
import {
  buildLocalePath,
  getLocaleFromPathname,
} from "@/app/i18n/pathname";

const localeLabels: Record<LocaleSegment, string> = {
  "pt-br": "PT-BR",
  "en-us": "EN-US",
};

export default function LanguageSwitcher() {
  const { t } = useTranslation("common");
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
    <div className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 p-1 text-xs text-white">
      <span className="sr-only">{t("language.switcher")}</span>
      {localeSegments.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => setLocale(locale)}
          aria-pressed={locale === activeLocale}
          className={cn(
            "rounded-full px-2 py-1 font-semibold uppercase transition",
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

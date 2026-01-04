"use client";

import { useI18nHelpers } from "@/app/i18n/HelpersProvider";
import { getLocaleFromPathname } from "@/app/i18n/pathname";
import { defaultLocale } from "@/app/i18n/settings";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CardListingAuthPrompt() {
  const { t } = useI18nHelpers();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? defaultLocale;
  const callbackUrl = pathname || `/${locale}`;
  const resolvedSignInUrl = `/${locale}/auth/signin?callbackUrl=${encodeURIComponent(
    callbackUrl
  )}`;

  return (
    <div className="flex flex-col items-start gap-3 bg-slate-900/70 shadow-[0_10px_24px_rgba(0,0,0,0.3)] mt-3 sm:mt-6 px-4 py-4 border border-white/10 rounded-xl text-white">
      <div className="text-[11px] text-white/50 uppercase tracking-[0.3em]">
        {t("auth.sign_in")}
      </div>
      <h2 className="text-lg font-(--font-display) text-white">
        {t("auth.sign_in_prices")}
      </h2>
      <Button asChild size="sm">
        <Link href={resolvedSignInUrl}>{t("auth.sign_in")}</Link>
      </Button>
    </div>
  );
}

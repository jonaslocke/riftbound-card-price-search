import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerTranslation } from "@/app/i18n/server";
import type { LocaleSegment } from "@/app/i18n/settings";

type CardListingAuthPromptProps = {
  locale: LocaleSegment;
  signInUrl?: string;
};

export default async function CardListingAuthPrompt({
  locale,
  signInUrl,
}: CardListingAuthPromptProps) {
  const { t } = await getServerTranslation(locale);
  const resolvedSignInUrl = signInUrl ?? `/${locale}/auth/signin`;

  return (
    <div className="mt-3 sm:mt-6 flex flex-col items-start gap-3 rounded-xl border border-white/10 bg-slate-900/70 px-4 py-4 text-white shadow-[0_10px_24px_rgba(0,0,0,0.3)]">
      <div className="text-[11px] uppercase tracking-[0.3em] text-white/50">
        {t("auth.sign_in")}
      </div>
      <h2 className="text-lg font-[var(--font-display)] text-white">
        {t("auth.sign_in_prices")}
      </h2>
      <Button asChild size="sm">
        <Link href={resolvedSignInUrl}>{t("auth.sign_in")}</Link>
      </Button>
    </div>
  );
}

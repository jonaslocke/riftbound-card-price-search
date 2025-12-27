import Link from "next/link";
import { Globe, MessageCircle, Youtube } from "lucide-react";
import { getServerTranslation } from "@/app/i18n/server";
import type { LocaleSegment } from "@/app/i18n/settings";

type SiteFooterProps = {
  locale: LocaleSegment;
};

export default async function SiteFooter({ locale }: SiteFooterProps) {
  const { t } = await getServerTranslation(locale);

  return (
    <footer className="mt-10 w-full border-t border-slate-400/20 bg-slate-950/85 px-4 py-10 text-sm text-white/70">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3 text-white/80">
          <div className="text-xs uppercase tracking-[0.2em]">
            {t("footer.social_label")}
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5"
              role="img"
              aria-label={t("footer.social_discord")}
            >
              <MessageCircle className="h-4 w-4" />
            </span>
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5"
              role="img"
              aria-label={t("footer.social_community")}
            >
              <Globe className="h-4 w-4" />
            </span>
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5"
              role="img"
              aria-label={t("footer.social_youtube")}
            >
              <Youtube className="h-4 w-4" />
            </span>
          </div>
        </div>
        <div className="space-y-3 leading-relaxed">
          <p>
            {t("footer.disclaimer_riot_prefix")}{" "}
            <Link
              href="https://www.riotgames.com/en/legal"
              className="text-white/90 underline underline-offset-4"
            >
              {t("footer.legal_jibber_jabber")}
            </Link>{" "}
            {t("footer.disclaimer_riot_suffix")}
          </p>
          <p>{t("footer.disclaimer_assets")}</p>
          <p>{t("footer.disclaimer_prices")}</p>
          <p>{t("footer.disclaimer_other")}</p>
        </div>
      </div>
    </footer>
  );
}

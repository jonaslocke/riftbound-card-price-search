import Link from "next/link";
import { Globe, MessageCircle, Youtube } from "lucide-react";
import { getServerTranslation } from "@/app/i18n/server";
import type { LocaleSegment } from "@/app/i18n/settings";

type SiteFooterProps = {
  locale: LocaleSegment;
};

export default async function SiteFooter({ locale }: SiteFooterProps) {
  const { t } = await getServerTranslation(locale);

  //TODO  I need to render this conditionally, if it is on route of login, is it possible to do that without "use client"?

  return (
    <footer className="bg-slate-950/85 mt-10 px-4 py-10 border-slate-400/20 border-t w-full text-white/70 text-sm">
      <div className="flex flex-col gap-6 mx-auto w-full max-w-5xl">
        <div className="flex flex-wrap items-center gap-3 text-white/80">
          <div className="text-xs uppercase tracking-[0.2em]">
            {t("footer.social_label")}
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex justify-center items-center bg-white/5 border border-white/10 rounded-full w-9 h-9"
              role="img"
              aria-label={t("footer.social_discord")}
            >
              <MessageCircle className="w-4 h-4" />
            </span>
            <span
              className="inline-flex justify-center items-center bg-white/5 border border-white/10 rounded-full w-9 h-9"
              role="img"
              aria-label={t("footer.social_community")}
            >
              <Globe className="w-4 h-4" />
            </span>
            <span
              className="inline-flex justify-center items-center bg-white/5 border border-white/10 rounded-full w-9 h-9"
              role="img"
              aria-label={t("footer.social_youtube")}
            >
              <Youtube className="w-4 h-4" />
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

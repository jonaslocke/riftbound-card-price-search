"use client";

import logo from "@/assets/brand/hextech-codex-gradient.svg";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import stamp from "@/assets/brand/icon-gradient.svg";

export default function SignInPage() {
  const { t } = useTranslation("common");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  return (
    <div className="min-h-screen w-full sm:bg-[#0a0f1c] text-white">
      <div className="grid min-h-screen w-full grid-cols-1 md:grid-cols-[1.1fr_0.9fr]">
        <div className="relative hidden overflow-hidden md:block">
          <Image
            src="/mystic-poro.webp"
            alt={t("auth.sign_in_hero_alt")}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute left-10 top-10 flex flex-col gap-4 z-1">
            <Image src={stamp} alt="Hextech Codex Logo" className="size-20" />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.2),rgba(2,6,23,0.85)_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,16,0.95)_0%,rgba(5,8,16,0.75)_15%,rgba(5,8,16,0.12)_60%,rgba(5,8,16,0)_100%)]" />
          <div className="absolute bottom-10 left-10 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-xs text-white/70 backdrop-blur">
            {t("auth.sign_in_promo")}
          </div>
        </div>
        <div className="relative flex flex-col gap-24 items-center justify-center px-6 py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.25),rgba(2,6,23,0.95)_55%)]" />
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-amber-400 via-orange-500 to-rose-500" />
          <Image src={logo} alt={t("brand.name")} className="h-14 w-auto z-1" />
          <div className="flex flex-col gap-3 relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur">
            <h1 className="text-3xl">{t("auth.sign_in_title")}</h1>
            <p className="text-sm text-white/70">
              {t("auth.sign_in_subtitle")}
            </p>
            <Button
              type="button"
              className="w-full"
              onClick={() => signIn("google", { callbackUrl })}
            >
              {t("auth.sign_in_google")}
            </Button>
            <div className="text-xs text-white/50">
              {t("auth.sign_in_disclaimer_prefix")}{" "}
              <Link
                href="https://www.riotgames.com/en/legal"
                className="underline"
              >
                {t("auth.sign_in_disclaimer_link")}
              </Link>
              .
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

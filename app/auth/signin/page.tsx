"use client";

import { useI18nHelpers } from "@/app/i18n/HelpersProvider";
import logo from "@/assets/brand/hextech-codex-gradient.svg";
import stamp from "@/assets/brand/icon-gradient.svg";
import { Button } from "@/components/ui/button";
import { readLastKnownPath } from "@/lib/lastKnownPath";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const { t } = useI18nHelpers();
  const searchParams = useSearchParams();
  const callbackUrlParam = searchParams.get("callbackUrl");
  const handleSignIn = () => {
    const callbackUrl = callbackUrlParam ?? readLastKnownPath("/") ?? "/";
    signIn("google", { callbackUrl });
  };

  return (
    <div className="sm:bg-[#0a0f1c] w-full min-h-screen text-white">
      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] w-full min-h-screen">
        <div className="hidden md:block relative overflow-hidden">
          <Image
            src="/mystic-poro.webp"
            alt={t("auth.sign_in_hero_alt")}
            fill
            className="object-cover"
            priority
          />
          <div className="top-10 left-10 z-1 absolute flex flex-col gap-4">
            <Image src={stamp} alt="Hextech Codex Logo" className="size-20" />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.2),rgba(2,6,23,0.85)_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,16,0.95)_0%,rgba(5,8,16,0.75)_15%,rgba(5,8,16,0.12)_60%,rgba(5,8,16,0)_100%)]" />
          <div className="bottom-10 left-10 absolute bg-white/10 backdrop-blur px-5 py-4 border border-white/10 rounded-2xl text-white/70 text-xs">
            {t("auth.sign_in_promo")}
          </div>
        </div>
        <div className="relative flex flex-col justify-center items-center gap-24 px-6 py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.25),rgba(2,6,23,0.95)_55%)]" />
          <div className="top-0 absolute inset-x-0 bg-linear-to-r from-amber-400 via-orange-500 to-rose-500 h-1" />
          <Image src={logo} alt={t("brand.name")} className="z-1 w-auto h-14" />
          <div className="z-10 relative flex flex-col gap-3 bg-white/5 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur p-8 border border-white/10 rounded-3xl w-full max-w-md">
            <h1 className="text-3xl">{t("auth.sign_in_title")}</h1>
            <p className="text-white/70 text-sm">
              {t("auth.sign_in_subtitle")}
            </p>
            <Button type="button" className="w-full" onClick={handleSignIn}>
              {t("auth.sign_in_google")}
            </Button>
            <div className="text-white/50 text-xs">
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

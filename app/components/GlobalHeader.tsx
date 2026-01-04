"use client";

import { useI18nHelpers } from "@/app/i18n/HelpersProvider";
import { getLocaleFromPathname } from "@/app/i18n/pathname";
import { defaultLocale } from "@/app/i18n/settings";
import logo from "@/assets/brand/hextech-index-gradient.svg";
import logoMobile from "@/assets/brand/hextech-index-hammer-gradient.svg";
import { readLastKnownPath } from "@/lib/lastKnownPath";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchFormWithAnalytics from "./analytics/SearchFormWithAnalytics";
import { SignInSignOut } from "./SignInSignOut";

export default function GlobalHeader() {
  const { t } = useI18nHelpers();
  const { data: session, status } = useSession();

  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? defaultLocale;
  const isAuthenticated = status === "authenticated";

  const signInCallbackUrl = pathname || `/${locale}`;
  const getCallbackUrl = () =>
    readLastKnownPath(signInCallbackUrl) ?? signInCallbackUrl;
  const handleSignIn = () => {
    signIn("google", { callbackUrl: getCallbackUrl() });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: getCallbackUrl() });
  };

  return (
    <header className="z-50 fixed items-center bg-slate-900/85 backdrop-blur-lg border-slate-400/20 border-b w-full container-padding">
      <div className="flex justify-between items-center gap-8 sm:gap-20 mx-auto py-3 w-full max-w-5xl">
        <Link href={`/${locale}`}>
          <Image
            src={logoMobile}
            alt={t("brand.name")}
            width={40}
            height={40}
            className="sm:hidden block"
          />
          <Image
            src={logo}
            alt={t("brand.name")}
            width={177}
            height={40}
            className="hidden sm:block"
          />
        </Link>
        <div className="flex-1">
          <SearchFormWithAnalytics
            placeholder={t("search.placeholder")}
            mobilePlaceholder={t("search.placeholder_mobile")}
            variant="header"
          />
        </div>
        <SignInSignOut
          isAuthenticated={isAuthenticated}
          displayName={session?.user?.name ?? ""}
          displayEmail={session?.user?.email ?? ""}
          imageUrl={session?.user?.image ?? ""}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          className="cursor-pointer"
          options={{
            avatar: {
              className: "size-10",
            },
          }}
        />
      </div>
    </header>
  );
}

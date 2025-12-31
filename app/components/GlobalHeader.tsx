"use client";

import { useI18nHelpers } from "@/app/i18n/HelpersProvider";
import { getLocaleFromPathname } from "@/app/i18n/pathname";
import { defaultLocale } from "@/app/i18n/settings";
import logo from "@/assets/brand/hextech-index-gradient.svg";
import { readLastKnownPath } from "@/lib/lastKnownPath";
import { cn } from "@/lib/utils";
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
    <header
      className={cn(
        "z-50 fixed items-center gap-3 bg-slate-900/85 backdrop-blur-lg border-slate-400/20 border-b w-full container-padding"
      )}
    >
      <div className="flex flex-wrap sm:flex-nowrap gap-y-3 mx-auto py-3 sm:pt-4 w-full max-w-5xl">
        <div className="flex items-center order-1 w-3/4 sm:w-2/6">
          <Link href={`/${locale}`} className="order-1">
            <Image src={logo} alt={t("brand.name")} className="w-full h-13 sm:h-12" />
          </Link>
        </div>
        <div className="flex items-center order-3 sm:order-2 w-full sm:w-3/6">
          <SearchFormWithAnalytics
            placeholder={t("search.placeholder")}
            mobilePlaceholder={t("search.placeholder_mobile")}
            variant="header"
          />
        </div>
        <div className="flex justify-end order-2 sm:order-3 w-1/4 sm:w-1/6">
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
      </div>
    </header>
  );
}

"use client";

import { useI18nHelpers } from "@/app/i18n/HelpersProvider";
import { getLocaleFromPathname, isLocaleRoot } from "@/app/i18n/pathname";
import { defaultLocale } from "@/app/i18n/settings";
import logo from "@/assets/brand/hextech-index-gradient.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { readLastKnownPath } from "@/lib/lastKnownPath";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ComponentProps,
  FC,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import SearchFormWithAnalytics from "./analytics/SearchFormWithAnalytics";
import { cn } from "@/lib/utils";
import { SignInSignOut } from "./SignInSignOut";

export default function GlobalHeader() {
  const { t } = useI18nHelpers();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? defaultLocale;
  const isHome = pathname === "/" || isLocaleRoot(pathname);
  const isAuthScreen = pathname?.includes("/auth/signin");
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  if (isHome || isAuthScreen) return null;

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
      <div className="flex flex-wrap sm:flex-nowrap items-center mx-auto w-full max-w-5xl h-34 sm:h-20">
        <div className="flex order-1 w-3/4 sm:w-2/6">
          <Link href={`/${locale}`} className="order-1">
            <Image src={logo} alt={t("brand.name")} className="w-full h-13" />
          </Link>
        </div>
        <div className="order-3 sm:order-2 w-full sm:w-3/6">
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

  return (
    <header
      className={cn(
        "z-50 fixed items-center gap-3 bg-slate-900/85 backdrop-blur-lg border-slate-400/20 border-b w-full container-padding"
      )}
    >
      <div
        className={cn(
          "flex flex-wrap items-center sm:gap-20",
          "mx-auto w-full max-w-5xl",
          "h-[112] sm:h-20"
        )}
      >
        <Link href={`/${locale}`} className="order-1">
          <Image src={logo} alt={t("brand.name")} className="w-full h-12" />
        </Link>
        <div className="sm:flex-1 order-3 sm:order-2 sm:px-10">
          <SearchFormWithAnalytics
            placeholder={t("search.placeholder")}
            mobilePlaceholder={t("search.placeholder_mobile")}
            variant="header"
          />
        </div>
        <div className="order-2 sm:order-3">
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

type AuthAvatarMenuProps = {
  avatarSize: string;
  isAuthenticated: boolean;
  displayName: string;
  displayEmail: string;
  imageUrl: string;
  onSignIn: () => void;
  onSignOut: () => void;
};

export function AuthAvatarMenu({
  avatarSize,
  isAuthenticated,
  displayName,
  displayEmail,
  imageUrl,
  onSignIn,
  onSignOut,
}: AuthAvatarMenuProps) {
  const { t } = useI18nHelpers();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const initials = useMemo(() => {
    const name = displayName?.trim();
    if (!name) return "HC";
    return name
      .split(" ")
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  }, [displayName]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={wrapperRef} className="relative">
      <Button variant="link" onClick={() => setIsOpen((open) => !open)}>
        <Avatar className={avatarSize}>
          <AvatarImage
            src={imageUrl || "/favicon-32x32.png"}
            alt={t("brand.name")}
          />
          <AvatarFallback className="bg-transparent! border-2 border-amber-300/60 font-ui font-semibold text-amber-300 sm:text-sm tracking-wider">
            {initials}
          </AvatarFallback>
        </Avatar>
      </Button>
      {isOpen && (
        <div
          role="menu"
          className="top-full right-0 z-50 absolute bg-slate-950/95 shadow-xl mt-2 p-2 border border-white/10 rounded-2xl w-56 overflow-hidden text-white text-sm"
        >
          {isAuthenticated ? (
            <>
              <div className="px-3 py-2 text-white/50 text-xs uppercase tracking-[0.2em]">
                {t("auth.signed_in_as")}
              </div>
              <div className="px-3 pb-2 font-semibold text-white text-sm">
                {displayName || "Google User"}
              </div>
              {displayEmail && (
                <div className="px-3 pb-3 text-white/60 text-xs">
                  {displayEmail}
                </div>
              )}
              <Button
                variant="destructive"
                className="w-full"
                type="button"
                role="menuitem"
                onClick={onSignOut}
              >
                {t("auth.sign_out")}
              </Button>
            </>
          ) : (
            <>
              <div className="px-3 py-2 text-white/50 text-xs uppercase tracking-[0.2em]">
                {t("auth.signed_in_as")}
              </div>
              <div className="px-3 pb-3 text-white/70 text-xs">
                {t("auth.sign_in")}
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={onSignIn}
                className="bg-white hover:bg-white/90 px-3 py-2 rounded-xl w-full font-semibold text-slate-900 text-left"
              >
                {t("auth.sign_in")}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

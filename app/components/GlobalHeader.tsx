"use client";

import { useI18nHelpers } from "@/app/i18n/HelpersProvider";
import { getLocaleFromPathname, isLocaleRoot } from "@/app/i18n/pathname";
import { defaultLocale } from "@/app/i18n/settings";
import logo from "@/assets/brand/hextech-codex-gradient.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { readLastKnownPath } from "@/lib/lastKnownPath";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import SearchFormWithAnalytics from "./analytics/SearchFormWithAnalytics";

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
    <>
      <header className="top-0 z-40 fixed inset-x-0 flex flex-col gap-3 bg-slate-900/85 backdrop-blur-lg px-4 md:px-6 py-3 border-slate-400/20 border-b md:h-16">
        <div className="flex flex-col sm:items-center gap-3 sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,520px)_minmax(0,1fr)] mx-auto w-full max-w-6xl">
          <div className="flex justify-between sm:justify-start items-center">
            <Link href={`/${locale}`} className="flex-1 sm:flex-none">
              <Image
                src={logo}
                alt={t("brand.name")}
                className="w-auto h-10 sm:h-8"
              />
            </Link>
            <div className="sm:hidden flex items-center gap-2">
              {isAuthenticated ? (
                <AuthAvatarMenu
                  ariaLabel={t("brand.name")}
                  avatarFallback="HC"
                  avatarSize="size-11"
                  isAuthenticated={isAuthenticated}
                  displayName={session?.user?.name ?? ""}
                  displayEmail={session?.user?.email ?? ""}
                  imageUrl={session?.user?.image ?? ""}
                  signInLabel={t("auth.sign_in")}
                  signOutLabel={t("auth.sign_out")}
                  signedInAsLabel={t("auth.signed_in_as")}
                  onSignIn={handleSignIn}
                  onSignOut={handleSignOut}
                />
              ) : (
                <Button asChild size="sm">
                  <Link
                    href={`/${locale}/auth/signin?callbackUrl=${encodeURIComponent(
                      signInCallbackUrl
                    )}`}
                  >
                    {t("auth.sign_in")}
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center sm:mx-auto w-full">
            <SearchFormWithAnalytics
              placeholder={t("search.placeholder")}
              mobilePlaceholder={t("search.placeholder_mobile")}
              variant="header"
            />
          </div>
          <div className="hidden sm:flex justify-end items-center gap-3">
            {isAuthenticated ? (
              <AuthAvatarMenu
                ariaLabel={t("brand.name")}
                avatarFallback="HC"
                avatarSize="size-9"
                isAuthenticated={isAuthenticated}
                displayName={session?.user?.name ?? ""}
                displayEmail={session?.user?.email ?? ""}
                imageUrl={session?.user?.image ?? ""}
                signInLabel={t("auth.sign_in")}
                signOutLabel={t("auth.sign_out")}
                signedInAsLabel={t("auth.signed_in_as")}
                onSignIn={handleSignIn}
                onSignOut={handleSignOut}
              />
            ) : (
              <Button asChild size="sm">
                <Link
                  href={`/${locale}/auth/signin?callbackUrl=${encodeURIComponent(
                    signInCallbackUrl
                  )}`}
                >
                  {t("auth.sign_in")}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

type AuthAvatarMenuProps = {
  ariaLabel: string;
  avatarFallback: string;
  avatarSize: string;
  isAuthenticated: boolean;
  displayName: string;
  displayEmail: string;
  imageUrl: string;
  signInLabel: string;
  signOutLabel: string;
  signedInAsLabel: string;
  onSignIn: () => void;
  onSignOut: () => void;
};

export function AuthAvatarMenu({
  ariaLabel,
  avatarFallback,
  avatarSize,
  isAuthenticated,
  displayName,
  displayEmail,
  imageUrl,
  signInLabel,
  signOutLabel,
  signedInAsLabel,
  onSignIn,
  onSignOut,
}: AuthAvatarMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const initials = useMemo(() => {
    const name = displayName?.trim();
    if (!name) return avatarFallback;
    return name
      .split(" ")
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  }, [displayName, avatarFallback]);

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
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="rounded-full hover:scale-[1.02] transition"
      >
        <Avatar className={avatarSize}>
          <AvatarImage src={imageUrl || "/favicon-32x32.png"} alt={ariaLabel} />
          <AvatarFallback className="bg-transparent! border-2 border-amber-300/60 font-ui font-semibold text-amber-300 sm:text-sm tracking-wider">
            {initials}
          </AvatarFallback>
        </Avatar>
      </button>
      {isOpen && (
        <div
          role="menu"
          className="top-full right-0 z-50 absolute bg-slate-950/95 shadow-xl mt-2 p-2 border border-white/10 rounded-2xl w-56 overflow-hidden text-white text-sm"
        >
          {isAuthenticated ? (
            <>
              <div className="px-3 py-2 text-white/50 text-xs uppercase tracking-[0.2em]">
                {signedInAsLabel}
              </div>
              <div className="px-3 pb-2 font-semibold text-white text-sm">
                {displayName || "Google User"}
              </div>
              {displayEmail && (
                <div className="px-3 pb-3 text-white/60 text-xs">
                  {displayEmail}
                </div>
              )}
              <button
                type="button"
                role="menuitem"
                onClick={onSignOut}
                className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl w-full text-white text-left"
              >
                {signOutLabel}
              </button>
            </>
          ) : (
            <>
              <div className="px-3 py-2 text-white/50 text-xs uppercase tracking-[0.2em]">
                {signedInAsLabel}
              </div>
              <div className="px-3 pb-3 text-white/70 text-xs">
                {signInLabel}
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={onSignIn}
                className="bg-white hover:bg-white/90 px-3 py-2 rounded-xl w-full font-semibold text-slate-900 text-left"
              >
                {signInLabel}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

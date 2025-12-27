"use client";

import logo from "@/assets/brand/hextech-codex-gradient.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchForm from "./SearchForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { defaultLocale } from "@/app/i18n/settings";
import {
  getLocaleFromPathname,
  isLocaleRoot,
} from "@/app/i18n/pathname";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalHeader() {
  const { t } = useTranslation("common");
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? defaultLocale;
  const isHome = pathname === "/" || isLocaleRoot(pathname);
  const isAuthScreen = pathname?.includes("/auth/signin");
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  if (isHome || isAuthScreen) return null;

  const callbackUrl = pathname || `/${locale}`;
  const handleSignIn = () => {
    signIn("google", { callbackUrl });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: `/${locale}` });
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex flex-col gap-3 border-b border-slate-400/20 bg-slate-900/85 px-4 py-3 backdrop-blur-lg md:px-6 md:h-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,520px)_minmax(0,1fr)] sm:items-center">
          <div className="flex items-center justify-between sm:justify-start">
            <Link href={`/${locale}`} className="flex-1 sm:flex-none">
              <Image
                src={logo}
                alt={t("brand.name")}
                className="h-10 w-auto sm:h-8"
              />
            </Link>
            <div className="flex items-center gap-2 sm:hidden">
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
                      callbackUrl
                    )}`}
                  >
                    {t("auth.sign_in")}
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <div className="flex w-full items-center sm:mx-auto">
            <SearchForm
              placeholder={t("search.placeholder")}
              variant="header"
            />
          </div>
          <div className="hidden items-center justify-end gap-3 sm:flex">
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
                    callbackUrl
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

function AuthAvatarMenu({
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
        className="rounded-full transition hover:scale-[1.02]"
      >
        <Avatar className={avatarSize}>
          <AvatarImage src={imageUrl || "/favicon-32x32.png"} alt={ariaLabel} />
          <AvatarFallback className="bg-transparent! font-ui font-semibold tracking-wider text-amber-300 border-2 border-amber-300/60 sm:text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
      </button>
      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 p-2 text-sm text-white shadow-xl"
        >
          {isAuthenticated ? (
            <>
              <div className="px-3 py-2 text-xs uppercase tracking-[0.2em] text-white/50">
                {signedInAsLabel}
              </div>
              <div className="px-3 pb-2 text-sm font-semibold text-white">
                {displayName || "Google User"}
              </div>
              {displayEmail && (
                <div className="px-3 pb-3 text-xs text-white/60">
                  {displayEmail}
                </div>
              )}
              <button
                type="button"
                role="menuitem"
                onClick={onSignOut}
                className="w-full rounded-xl bg-white/10 px-3 py-2 text-left text-white hover:bg-white/20"
              >
                {signOutLabel}
              </button>
            </>
          ) : (
            <>
              <div className="px-3 py-2 text-xs uppercase tracking-[0.2em] text-white/50">
                {signedInAsLabel}
              </div>
              <div className="px-3 pb-3 text-xs text-white/70">
                {signInLabel}
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={onSignIn}
                className="w-full rounded-xl bg-white px-3 py-2 text-left font-semibold text-slate-900 hover:bg-white/90"
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

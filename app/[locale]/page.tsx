"use client";

import logo from "@/assets/brand/hextech-codex-gradient.svg";
import { Moon, Sun } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthAvatarMenu } from "../components/GlobalHeader";
import SearchForm from "../components/SearchForm";
import { getLocaleFromPathname } from "../i18n/pathname";
import { defaultLocale } from "../i18n/settings";

export default function Home() {
  const { t } = useTranslation("common");
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? defaultLocale;
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? window.localStorage.getItem("rift-theme")
        : null;
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
      return;
    }

    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = prefersDark ? "dark" : "light";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("rift-theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const callbackUrl = pathname || `/${locale}`;
  const handleSignIn = () => {
    signIn("google", { callbackUrl });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: `/${locale}` });
  };

  return (
    <main className="mx-auto mt-[clamp(24px,6vw,56px)] mb-[clamp(24px,8vw,64px)] flex w-full max-w-2xl flex-col gap-4 px-[clamp(16px,4vw,32px)]">
      {isAuthenticated && (
        <div className="fixed right-4 top-4 z-20 hidden sm:block">
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
        </div>
      )}
      <button
        className="fixed right-4 bottom-4 z-20 rounded-full border border-border bg-(--panel) px-3 py-2 text-(--text-primary) shadow-(--shadow) transition hover:-translate-y-px hover:border-accent hover:bg-(--panel-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-0"
        type="button"
        onClick={toggleTheme}
        aria-label={
          theme === "dark"
            ? t("theme.switch_to_light")
            : t("theme.switch_to_dark")
        }
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <h1 className="sr-only">{t("brand.name")}</h1>
      <div className="flex justify-center">
        <Image src={logo} alt={t("brand.name")} className="w-80 sm:w-96" />
      </div>
      <p className="text-sm leading-relaxed text-accent text-center">
        {t("home.tagline")}
      </p>

      <SearchForm
        placeholder={t("search.placeholder")}
        mobilePlaceholder={t("search.placeholder_mobile")}
      />
    </main>
  );
}

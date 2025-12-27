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

export default function GlobalHeader() {
  const { t } = useTranslation("common");
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? defaultLocale;
  const isHome = pathname === "/" || isLocaleRoot(pathname);

  if (isHome) return null;

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
              <Avatar className="size-11">
                <AvatarImage src="/favicon-32x32.png" alt={t("brand.name")} />
                <AvatarFallback className="bg-transparent! font-ui font-semibold tracking-wider text-amber-300 border-2 border-amber-300/60">
                  HC
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="flex w-full items-center sm:mx-auto">
            <SearchForm
              placeholder={t("search.placeholder")}
              variant="header"
            />
          </div>
          <div className="hidden items-center justify-end gap-3 sm:flex">
            <Avatar className="size-9">
              <AvatarImage src="/favicon-32x32.png" alt={t("brand.name")} />
              <AvatarFallback className="bg-transparent! font-ui font-semibold tracking-wider text-amber-300 border-2 border-amber-300/60 sm:text-sm">
                HC
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
    </>
  );
}

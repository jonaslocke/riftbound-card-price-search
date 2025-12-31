"use client";

import { useI18nHelpers } from "@/app/i18n/HelpersProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ComponentProps, FC, useMemo } from "react";
import { getLocaleFromPathname } from "../i18n/pathname";
import { defaultLocale } from "../i18n/settings";
import { usePathname } from "next/navigation";

type Props = {
  imageUrl: string;
  displayName: string;
  displayEmail: string;
  onSignIn: () => void;
  onSignOut: () => void;
  isAuthenticated: boolean;
  className?: ComponentProps<typeof DropdownMenuTrigger>["className"];
  options?: {
    avatar: ComponentProps<typeof Avatar>;
  };
};

export const SignInSignOut: FC<Props> = ({
  imageUrl,
  displayName,
  displayEmail,
  className,
  options,
  onSignIn,
  onSignOut,
  isAuthenticated,
}) => {
  const { t } = useI18nHelpers();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) ?? defaultLocale;
  const signInCallbackUrl = pathname || `/${locale}`;

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

  const signInUrl = useMemo(
    () =>
      `/${locale}/auth/signin?callbackUrl=${encodeURIComponent(
        signInCallbackUrl
      )}`,
    [locale, signInCallbackUrl]
  );

  if (!isAuthenticated) {
    return (
      <Link href={signInUrl}>
        <Button className={cn(className)}>{t("auth.sign_in")}</Button>
      </Link>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className={cn(className)}>
        <Avatar {...options?.avatar}>
          <AvatarImage
            src={imageUrl || "/favicon-32x32.png"}
            alt={t("brand.name")}
          />
          <AvatarFallback className="bg-transparent! border-2 border-amber-300/60 font-ui font-semibold text-amber-300 sm:text-sm tracking-wider">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="flex flex-col gap-2 bg-slate-900/85 shadow-2xl backdrop-blur-lg p-3 border border-slate-400/20 w-56 text-white text-sm"
      >
        <>
          <div className="text-white/50 text-xs uppercase tracking-[0.2em]">
            {t("auth.signed_in_as")}
          </div>
          <div className="font-semibold text-white text-sm">
            {displayName || "Google User"}
          </div>
          {displayEmail && (
            <div className="text-white/60 text-xs">{displayEmail}</div>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

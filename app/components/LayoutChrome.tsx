"use client";

import { writeLastKnownPath } from "@/lib/lastKnownPath";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";

type LayoutChromeProps = {
  header: ReactNode;
  children: ReactNode;
  footer: ReactNode;
};

export default function LayoutChrome({
  header,
  children,
  footer,
}: LayoutChromeProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams?.toString();
  const hideFooter = pathname?.includes("/auth/signin");

  useEffect(() => {
    if (!pathname || pathname.includes("/auth/signin")) return;
    const params = new URLSearchParams(search ?? "");
    const hasOAuthParams = params.has("code") && params.has("state");
    const oauthParams = ["state", "code", "scope", "authuser", "prompt"];
    let didStrip = false;
    if (hasOAuthParams) {
      oauthParams.forEach((key) => {
        if (!params.has(key)) return;
        params.delete(key);
        didStrip = true;
      });
    }
    if (didStrip) {
      const cleanedPath = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;
      router.replace(cleanedPath);
    }
    const fullPath = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    writeLastKnownPath(fullPath);
  }, [pathname, router, search]);

  return (
    <div className="flex min-h-screen w-full flex-col items-stretch">
      {header}
      <div className="min-h-screen flex-1">{children}</div>
      {!hideFooter && footer}
    </div>
  );
}

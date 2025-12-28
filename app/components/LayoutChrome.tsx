"use client";

import { writeLastKnownPath } from "@/lib/lastKnownPath";
import { usePathname, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const search = searchParams?.toString();
  const hideFooter = pathname?.includes("/auth/signin");

  useEffect(() => {
    if (!pathname || pathname.includes("/auth/signin")) return;
    const fullPath = search ? `${pathname}?${search}` : pathname;
    writeLastKnownPath(fullPath);
  }, [pathname, search]);

  return (
    <div className="flex min-h-screen w-full flex-col items-stretch">
      {header}
      <div className="min-h-screen flex-1">{children}</div>
      {!hideFooter && footer}
    </div>
  );
}

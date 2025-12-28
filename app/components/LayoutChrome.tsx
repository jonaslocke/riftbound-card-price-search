"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

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
  const hideFooter = pathname?.includes("/auth/signin");

  return (
    <div className="flex min-h-screen w-full flex-col items-stretch">
      {header}
      <div className="min-h-screen flex-1">{children}</div>
      {!hideFooter && footer}
    </div>
  );
}

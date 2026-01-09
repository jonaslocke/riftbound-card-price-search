"use client";

import { usePathname } from "next/navigation";
import type { PropsWithChildren, ReactNode } from "react";

interface LayoutChromeProps extends PropsWithChildren {
  header: ReactNode;
  footer: ReactNode;
}

export default function LayoutChrome({
  header,
  children,
  footer,
}: LayoutChromeProps) {
  const pathname = usePathname();
  const onlyContent = Boolean(pathname?.includes("/auth/signin"));

  return (
    <>
      {!onlyContent && header}
      <>{children}</>
      {!onlyContent && footer}
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function GlobalHeader() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <header className="global-header">
      <div className="global-header__inner">
        <Link className="global-brand" href="/">
          <span className="global-brand__dot" aria-hidden="true" />
          <span className="global-brand__text">Rift Search</span>
        </Link>
        <Link className="global-header__link" href="/">
          Back to search
        </Link>
      </div>
    </header>
  );
}

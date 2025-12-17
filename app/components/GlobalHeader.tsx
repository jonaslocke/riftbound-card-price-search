"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchForm from "./SearchForm";

export default function GlobalHeader() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <>
      <header className="global-header">
        <div className="global-header__inner">
          <Link className="global-brand" href="/">
            <span className="global-brand__dot" aria-hidden="true" />
            <span className="global-brand__text">Rift Search</span>
          </Link>
          <div className="global-header__search">
            <SearchForm placeholder="Search cards" />
          </div>
          <button className="global-avatar" type="button" aria-label="Account">
            RS
          </button>
        </div>
      </header>
      <div className="global-header-spacer" aria-hidden="true" />
    </>
  );
}

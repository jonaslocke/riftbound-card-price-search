"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchForm from "./SearchForm";

export default function GlobalHeader() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[rgba(148,163,184,0.2)] bg-[rgba(9,16,31,0.86)] px-4 py-3 backdrop-blur-[18px] md:px-6">
        <div className="mx-auto grid w-[96vw] max-w-270 grid-cols-1 items-start gap-3 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-6">
          <Link
            className="inline-flex items-center gap-[0.6rem] text-[0.78rem] font-bold uppercase tracking-[0.18em] text-(--text-primary) no-underline"
            href="/"
          >
            <span
              className="h-[0.65rem] w-[0.65rem] shrink-0 rounded-full bg-linear-to-br from-(--gold) to-(--copper) shadow-[0_0_12px_rgba(240,195,106,0.45)]"
              aria-hidden="true"
            />
            <span className="leading-none">Rift Search</span>
          </Link>
          <div className="w-full md:max-w-140 md:justify-self-center">
            <SearchForm placeholder="Search cards" variant="header" />
          </div>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(240,195,106,0.55)] bg-[rgba(15,23,42,0.85)] text-[0.85rem] font-bold tracking-[0.08em] text-(--gold) transition hover:-translate-y-px hover:border-[rgba(240,195,106,0.9)] hover:text-white hover:shadow-[0_10px_24px_rgba(2,6,23,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-0"
            type="button"
            aria-label="Account"
          >
            RS
          </button>
        </div>
      </header>
      <div className="h-[6.2rem] md:h-18" aria-hidden="true" />
    </>
  );
}

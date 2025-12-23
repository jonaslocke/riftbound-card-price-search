"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchForm from "./SearchForm";

export default function GlobalHeader() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-400/20 bg-slate-900/85 px-4 py-3 backdrop-blur-lg md:px-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 md:flex-row md:items-center md:gap-6">
          <Link
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-(--text-primary) no-underline md:shrink-0"
            href="/"
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full bg-linear-to-br from-(--gold) to-(--copper) shadow-lg"
              aria-hidden="true"
            />
            <span className="leading-none">Rift Search</span>
          </Link>
          <div className="w-full md:flex-1 md:max-w-xl md:mx-auto">
            <SearchForm
              placeholder="Search by card name (press / to focus)"
              variant="header"
            />
          </div>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-amber-300/60 bg-slate-900/80 text-sm font-bold tracking-wider text-(--gold) transition hover:-translate-y-px hover:border-amber-200 hover:text-white hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-0 md:shrink-0"
            type="button"
            aria-label="Account"
          >
            RS
          </button>
        </div>
      </header>
      <div className="h-4 md:h-2" aria-hidden="true" />
    </>
  );
}

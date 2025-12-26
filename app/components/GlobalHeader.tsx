"use client";

import logo from "@/assets/brand/hextech-codex-gradient.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchForm from "./SearchForm";

export default function GlobalHeader() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <>
      <header className="flex items-center fixed inset-x-0 top-0 z-40 border-b border-slate-400/20 bg-slate-900/85 px-4 py-3 backdrop-blur-lg md:px-6 h-16">
        <div className="mx-auto w-full max-w-6xl flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
          <Link
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-(--text-primary) no-underline md:shrink-0"
            href="/"
          >
            <Image src={logo} alt="Hextech Codex" height={32} />
          </Link>
          <div className="w-full flex items-center md:flex-1 md:max-w-xl md:mx-auto">
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
            HC
          </button>
        </div>
      </header>
    </>
  );
}

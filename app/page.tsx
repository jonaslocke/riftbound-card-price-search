"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import SearchForm from "./components/SearchForm";

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? window.localStorage.getItem("rift-theme")
        : null;
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
      return;
    }

    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = prefersDark ? "dark" : "light";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("rift-theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <main className="mx-auto flex w-full max-w-160 flex-col gap-6 px-3 sm:px-4">
      <button
        className="fixed right-4 top-4 z-20 rounded-full border border-(--border) bg-(--panel) px-3 py-2 text-(--text-primary) shadow-(--shadow) transition hover:-translate-y-px hover:border-(--accent) hover:bg-(--panel-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-0"
        type="button"
        onClick={toggleTheme}
        aria-label={
          theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        }
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <section className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.12em] text-(--text-muted)">
          Rift Search
        </p>
        <h1 className="text-4xl font-bold leading-tight text-(--text-primary) sm:text-5xl">
          Card search
        </h1>
        <p className="text-base leading-relaxed text-(--text-muted)">
          Find any Riftbound card by name and track it across your favorite
          shops.
        </p>
      </section>

      <SearchForm placeholder="Search cards by name" />
    </main>
  );
}

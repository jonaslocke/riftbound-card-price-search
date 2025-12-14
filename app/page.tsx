"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import SearchForm from "./components/SearchForm";

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("rift-theme") : null;
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

  useEffect(() => {
    let active = true;

    async function pickBackground() {
      try {
        const res = await fetch("/api/backgrounds", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load backgrounds");
        const data = await res.json();
        const list: string[] = Array.isArray(data?.items) ? data.items : [];
        const file =
          list.length > 0
            ? list[Math.floor(Math.random() * list.length)]
            : "bg1.webp";
        if (!active) return;
        document.documentElement.style.setProperty(
          "--bg-image",
          `url("/assets/backgrounds/${file}")`
        );
      } catch {
        document.documentElement.style.setProperty(
          "--bg-image",
          `url("/assets/backgrounds/bg1.webp")`
        );
      }
    }

    pickBackground();
    return () => {
      active = false;
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <main className="search-shell">
      <button
        className="theme-toggle theme-toggle--floating"
        type="button"
        onClick={toggleTheme}
        aria-label={
          theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        }
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <section className="search-copy">
        <p className="eyebrow">Rift Search</p>
        <h1 className="hero-title">Card search</h1>
        <p className="hero-subtitle">
          Find any Riftbound card by name and track it across your favorite
          shops.
        </p>
      </section>

      <SearchForm placeholder="Search cards by name" />
    </main>
  );
}

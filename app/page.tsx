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

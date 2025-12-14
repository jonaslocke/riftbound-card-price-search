"use client";

import { useEffect, useState } from "react";
import SearchForm from "./components/SearchForm";

const BACKGROUNDS = ["bg1.webp", "bg2.webp", "bg3.webp", "bg4.webp", "bg5.webp", "bg6.webp"];

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
    const pick = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
    document.documentElement.style.setProperty(
      "--bg-image",
      `url("/assets/backgrounds/${pick}")`
    );
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
        {theme === "dark" ? <IconSun /> : <IconMoon />}
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

function IconSun() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

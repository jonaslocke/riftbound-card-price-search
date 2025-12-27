"use client";

import logo from "@/assets/brand/hextech-codex-gradient.svg";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";
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
    <main className="mx-auto mt-[clamp(24px,6vw,56px)] mb-[clamp(24px,8vw,64px)] flex w-full max-w-2xl flex-col gap-4 px-[clamp(16px,4vw,32px)]">
      <button
        className="fixed right-4 top-4 z-20 rounded-full border border-border bg-(--panel) px-3 py-2 text-(--text-primary) shadow-(--shadow) transition hover:-translate-y-px hover:border-accent hover:bg-(--panel-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-0"
        type="button"
        onClick={toggleTheme}
        aria-label={
          theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        }
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <h1 className="sr-only">Hextech Codex</h1>
      <div className="flex justify-center">
        <Image src={logo} alt="Hextech Codex"></Image>
      </div>
      <p className="text-base leading-relaxed text-accent">
        Find and compare Riftbound card prices across multiple stores
      </p>

      <SearchForm placeholder="Search by card name (press / to focus)" />
    </main>
  );
}

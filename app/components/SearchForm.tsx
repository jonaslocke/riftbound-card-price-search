// "use client" is required because we fetch suggestions as the user types.
"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import type { Card } from "../types/card";
import CardSuggestionItem from "./CardSuggestionItem";

type SearchFormProps = {
  placeholder?: string;
  name?: string;
  onCardSelect?: (card: Card) => void;
  variant?: "default" | "header";
};

export default function SearchForm({
  placeholder = "Search by card name (press / to focus)",
  name = "query",
  onCardSelect,
  variant = "default",
}: SearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isHeader = variant === "header";

  const clearTimers = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    abortRef.current?.abort();
  }, []);

  const closeSuggestions = useCallback((options?: { clear?: boolean }) => {
    clearTimers();
    if (options?.clear) {
      setSuggestions([]);
    }
    setHighlightedIndex(-1);
    setIsOpen(false);
  }, [clearTimers]);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      clearTimers();
      setSuggestions([]);
      setHighlightedIndex(-1);
      setSelectedId(null);
      setError(null);
      setLoading(false);
      setIsOpen(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(trimmed);
    }, 200);

    return () => {
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  async function fetchSuggestions(value: string) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/cards/search?q=${encodeURIComponent(value)}`,
        {
          signal: controller.signal,
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message = body?.error ?? "Unable to search right now.";
        throw new Error(message);
      }

      const data = await res.json();
      setSuggestions(data.items ?? []);
      setHighlightedIndex((data.items ?? []).length > 0 ? 0 : -1);
      setIsOpen(true);
      setSelectedId(null);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setSuggestions([]);
      setHighlightedIndex(-1);
      setError((err as Error).message);
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  }

  function navigateToCard(card: Card) {
    const setId = card.set?.set_id;
    const collector = card.collector_number ?? null;

    if (setId && collector !== null) {
      router.push(`/cards/${setId}-${collector}`);
    }
  }

  function handleSelect(card: Card) {
    setSelectedId(card.id);
    setQuery("");
    closeSuggestions({ clear: true });
    onCardSelect?.(card);
    navigateToCard(card);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (highlightedIndex < 0 || highlightedIndex >= suggestions.length) return;
    handleSelect(suggestions[highlightedIndex]);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      closeSuggestions();
      return;
    }
    if (suggestions.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(0);
        return;
      }
      setHighlightedIndex((prev) =>
        prev + 1 >= suggestions.length ? 0 : prev + 1
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(suggestions.length - 1);
        return;
      }
      setHighlightedIndex((prev) =>
        prev - 1 < 0 ? suggestions.length - 1 : prev - 1
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (
        isOpen &&
        highlightedIndex >= 0 &&
        highlightedIndex < suggestions.length
      ) {
        handleSelect(suggestions[highlightedIndex]);
      }
    }
  }

  const showSuggestions = isOpen && suggestions.length > 0;

  function handleClear() {
    setQuery("");
    setSuggestions([]);
    setHighlightedIndex(-1);
    setSelectedId(null);
    setError(null);
    clearTimers();
    setIsOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      const target = event.target as Node | null;
      if (!target || !formRef.current) return;
      if (!formRef.current.contains(target)) {
        closeSuggestions();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [closeSuggestions]);

  useEffect(() => {
    function handleSlashShortcut(event: KeyboardEvent) {
      if (event.key !== "/") return;
      const target = event.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") {
        return;
      }
      if (event.defaultPrevented) return;
      event.preventDefault();
      inputRef.current?.focus();
    }

    document.addEventListener("keydown", handleSlashShortcut);
    return () => {
      document.removeEventListener("keydown", handleSlashShortcut);
    };
  }, []);

  const suggestionsClassName = `list-none w-full rounded-lg border border-(--border) bg-(--panel) p-2 shadow-(--shadow) ${
    isHeader
      ? "absolute left-0 right-0 top-full z-50 mt-2 flex flex-col gap-1"
      : "mt-2 flex flex-col gap-1"
  }`;

  return (
    <form
      className="relative w-full"
      role="search"
      action="#"
      method="get"
      onSubmit={handleSubmit}
      autoComplete="off"
      aria-busy={loading}
      ref={formRef}
    >
      <label className="visually-hidden" htmlFor="search-input">
        Search
      </label>
      <div
        className={`relative flex items-center rounded-full border shadow-(--shadow) transition ${
          isHeader
            ? "h-10 border-slate-400/40 bg-slate-900/80 px-3"
            : "h-12 border-border bg-(--pill) px-4"
        }`}
      >
        <span
          className={`pointer-events-none absolute inline-flex items-center justify-center text-(--text-muted) ${
            isHeader ? "left-3" : "left-4"
          }`}
          aria-hidden="true"
        >
          <Search size={16} strokeWidth={2} />
        </span>
        <input
          id="search-input"
          name={name}
          type="search"
          placeholder={placeholder}
          className={`h-full w-full border-0 bg-transparent text-(--text-primary) placeholder:text-slate-400 focus:outline-none ${
            isHeader ? "pl-8 pr-11 text-sm" : "pl-10 pr-12 text-base"
          }`}
          value={query}
          ref={inputRef}
          onChange={(event) => {
            setQuery(event.target.value);
            if (event.target.value.trim().length >= 2) {
              setIsOpen(true);
            }
          }}
          aria-controls="card-suggestions"
          aria-expanded={showSuggestions}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
        />
        {query.length > 0 ? (
          <button
            type="button"
            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-(--border) bg-transparent text-(--text-primary) transition hover:border-(--accent) hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-0"
            aria-label="Clear search"
            onClick={handleClear}
          >
            ×
          </button>
        ) : null}
        <span
          className={`absolute right-11 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-(--border) border-t-(--accent) transition-opacity duration-100 ${
            loading ? "opacity-100 animate-spin" : "opacity-0"
          }`}
          aria-hidden="true"
        />
      </div>

      {error ? (
        <p className="mt-2 text-sm text-(--text-muted)" role="status">
          {error}
        </p>
      ) : null}

      {showSuggestions && (
        <ul
          id="card-suggestions"
          className={suggestionsClassName}
          role="listbox"
          aria-label="Card search suggestions"
        >
          {suggestions.map((card, index) => {
            const isActive = index === highlightedIndex;

            return (
              <li
                key={card.id}
                role="option"
                aria-selected={isActive || card.id === selectedId}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <CardSuggestionItem
                  card={card}
                  isActive={isActive}
                  onSelect={handleSelect}
                />
              </li>
            );
          })}
        </ul>
      )}
    </form>
  );
}

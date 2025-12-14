// "use client" is required because we fetch suggestions as the user types.
"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type CardSuggestion = {
  id: string;
  name: string;
  setLabel: string | null;
  setId: string | null;
  collectorNumber: number | null;
  publicCode: string | null;
  riftboundId: string | null;
  type: string | null;
  rarity: string | null;
};

type SearchFormProps = {
  placeholder?: string;
  name?: string;
  onCardSelect?: (card: CardSuggestion) => void;
};

export default function SearchForm({
  placeholder = "Search...",
  name = "query",
  onCardSelect,
}: SearchFormProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CardSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
      setSuggestions([]);
      setSelectedId(null);
      setError(null);
      setLoading(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(trimmed);
    }, 220);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
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
      const res = await fetch(`/api/cards/search?q=${encodeURIComponent(value)}`, {
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message = body?.error ?? "Unable to search right now.";
        throw new Error(message);
      }

      const data = await res.json();
      setSuggestions(data.items ?? []);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setSuggestions([]);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(card: CardSuggestion) {
    setSelectedId(card.id);
    setQuery(card.name);
    onCardSelect?.(card);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selectedId) return;
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    }
  }

  return (
    <form
      className="search-form"
      role="search"
      action="#"
      method="get"
      onSubmit={handleSubmit}
      autoComplete="off"
      aria-busy={loading}
    >
      <label className="visually-hidden" htmlFor="search-input">
        Search
      </label>
      <input
        id="search-input"
        name={name}
        type="search"
        placeholder={placeholder}
        className="search-input"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        aria-controls="card-suggestions"
        aria-expanded={suggestions.length > 0}
      />

      {error ? (
        <p className="search-hint" role="status">
          {error}
        </p>
      ) : null}

      {loading && (
        <p className="search-hint" role="status">
          Searching...
        </p>
      )}

      {suggestions.length > 0 && (
        <ul
          id="card-suggestions"
          className="search-suggestions"
          role="listbox"
          aria-label="Card search suggestions"
        >
          {suggestions.map((card) => {
            const meta = [card.setLabel, card.publicCode].filter(Boolean).join(" - ");
            return (
              <li key={card.id} role="option" aria-selected={card.id === selectedId}>
                <button
                  type="button"
                  className="search-suggestion"
                  onClick={() => handleSelect(card)}
                >
                  <span className="search-suggestion__title">{card.name}</span>
                  {meta ? <span className="search-suggestion__meta">{meta}</span> : null}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </form>
  );
}

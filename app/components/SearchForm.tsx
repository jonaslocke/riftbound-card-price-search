// "use client" is required because we fetch suggestions as the user types.
"use client";

import { Image as ImageIcon, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

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
  media?: { image_url?: string };
  set?: { set_id?: string; label?: string };
  collector_number?: number;
};

type SearchFormProps = {
  placeholder?: string;
  name?: string;
  onCardSelect?: (card: CardSuggestion) => void;
};

export default function SearchForm({
  placeholder = "Search cards",
  name = "query",
  onCardSelect,
}: SearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CardSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      clearTimers();
      setSuggestions([]);
      setHighlightedIndex(-1);
      setSelectedId(null);
      setError(null);
      setLoading(false);
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

  function clearTimers() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    abortRef.current?.abort();
  }

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
      setHighlightedIndex(0);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setSuggestions([]);
      setHighlightedIndex(-1);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function navigateToCard(card: CardSuggestion) {
    const setId = card.set?.set_id ?? card.setId;
    const collector = card.collector_number ?? card.collectorNumber ?? null;

    if (setId && collector !== null) {
      router.push(`/cards/${setId}-${collector}`);
    }
  }

  function handleSelect(card: CardSuggestion) {
    setSelectedId(card.id);
    setQuery(card.name);
    onCardSelect?.(card);
    navigateToCard(card);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (highlightedIndex < 0 || highlightedIndex >= suggestions.length) return;
    handleSelect(suggestions[highlightedIndex]);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (suggestions.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        prev + 1 >= suggestions.length ? 0 : prev + 1
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        prev - 1 < 0 ? suggestions.length - 1 : prev - 1
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleSelect(suggestions[highlightedIndex]);
      }
    }
  }

  const showSuggestions = suggestions.length > 0;

  function handleClear() {
    setQuery("");
    setSuggestions([]);
    setHighlightedIndex(-1);
    setSelectedId(null);
    setError(null);
    clearTimers();
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
      <div className="search-input-wrapper">
        <span className="search-icon" aria-hidden="true">
          <Search size={16} strokeWidth={2} />
        </span>
        <input
          id="search-input"
          name={name}
          type="search"
          placeholder={placeholder}
          className="search-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-controls="card-suggestions"
          aria-expanded={showSuggestions}
          onKeyDown={handleKeyDown}
        />
        {query.length > 0 ? (
          <button
            type="button"
            className="search-clear"
            aria-label="Clear search"
            onClick={handleClear}
          >
            ×
          </button>
        ) : null}
        <span
          className={`search-spinner ${
            loading ? "search-spinner--visible" : ""
          }`}
          aria-hidden="true"
        />
      </div>

      {error ? (
        <p className="search-hint" role="status">
          {error}
        </p>
      ) : null}

      {showSuggestions && (
        <ul
          id="card-suggestions"
          className="search-suggestions"
          role="listbox"
          aria-label="Card search suggestions"
        >
          {suggestions.map((card, index) => {
            const meta = [card.set?.set_id ?? card.setLabel, card.publicCode]
              .filter(Boolean)
              .join(" - ");
            const isActive = index === highlightedIndex;
            const image = card.media?.image_url;

            return (
              <li
                key={card.id}
                role="option"
                aria-selected={isActive || card.id === selectedId}
              >
                <button
                  type="button"
                  className={`search-suggestion ${isActive ? "is-active" : ""}`}
                  onClick={() => handleSelect(card)}
                >
                  <span className="search-suggestion__thumb">
                    {image ? (
                      <img src={image} alt="" loading="lazy" />
                    ) : (
                      <span aria-hidden>
                        <ImageIcon size={18} />
                      </span>
                    )}
                  </span>
                  <span className="search-suggestion__body">
                    <span className="search-suggestion__title">
                      {card.name}
                    </span>
                    {meta ? (
                      <span className="search-suggestion__meta">{meta}</span>
                    ) : null}
                  </span>
                  <span className="search-suggestion__code">
                    {card.collector_number ?? card.collectorNumber ?? ""}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </form>
  );
}

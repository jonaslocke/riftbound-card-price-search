"use client";

import { useI18nHelpers } from "@/app/i18n/HelpersProvider";
import { getLocaleFromPathname } from "@/app/i18n/pathname";
import { defaultLocale } from "@/app/i18n/settings";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CircleX, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useTransition,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import type { Card } from "../types/card";
import CardSuggestionItem from "./CardSuggestionItem";

const DEBOUNCED_SEARCH_TIMER = 700;

type SearchFormProps = {
  placeholder?: string;
  mobilePlaceholder?: string;
  name?: string;
  onCardSelect?: (card: Card) => void | Promise<void>;
  variant?: "default" | "header";
};

type SearchFormState = {
  isMobile: boolean;
  query: string;
  suggestions: Card[];
  loading: boolean;
  error: string | null;
  selectedId: string | null;
  isSelecting: boolean;
  highlightedIndex: number;
  isOpen: boolean;
  showMinCharsHelper: boolean;
};

type SearchFormAction =
  | { type: "setMobile"; value: boolean }
  | { type: "setQuery"; value: string }
  | { type: "setOpen"; value: boolean }
  | { type: "setHighlightedIndex"; value: number }
  | { type: "setShowMinCharsHelper"; value: boolean }
  | { type: "fetchStart" }
  | { type: "fetchSuccess"; items: Card[] }
  | { type: "fetchError"; message: string }
  | { type: "fetchAbort" }
  | { type: "closeSuggestions"; clear?: boolean }
  | { type: "resetForEmptyQuery" }
  | { type: "resetForShortQuery" }
  | { type: "selectStart"; id: string }
  | { type: "selectEnd" }
  | { type: "clearAll" };

const initialState: SearchFormState = {
  isMobile: false,
  query: "",
  suggestions: [],
  loading: false,
  error: null,
  selectedId: null,
  isSelecting: false,
  highlightedIndex: -1,
  isOpen: false,
  showMinCharsHelper: false,
};

function reducer(
  state: SearchFormState,
  action: SearchFormAction
): SearchFormState {
  switch (action.type) {
    case "setMobile":
      return { ...state, isMobile: action.value };
    case "setQuery":
      return { ...state, query: action.value };
    case "setOpen":
      return { ...state, isOpen: action.value };
    case "setHighlightedIndex":
      return { ...state, highlightedIndex: action.value };
    case "setShowMinCharsHelper":
      return { ...state, showMinCharsHelper: action.value };
    case "fetchStart":
      return { ...state, loading: true, error: null };
    case "fetchSuccess":
      return {
        ...state,
        loading: false,
        suggestions: action.items,
        highlightedIndex: action.items.length > 0 ? 0 : -1,
        isOpen: true,
        selectedId: null,
      };
    case "fetchError":
      return {
        ...state,
        loading: false,
        suggestions: [],
        highlightedIndex: -1,
        isOpen: false,
        error: action.message,
      };
    case "fetchAbort":
      return {
        ...state,
        loading: false,
      };
    case "closeSuggestions":
      return {
        ...state,
        suggestions: action.clear ? [] : state.suggestions,
        highlightedIndex: -1,
        isOpen: false,
      };
    case "resetForEmptyQuery":
    case "resetForShortQuery":
      return {
        ...state,
        suggestions: [],
        highlightedIndex: -1,
        selectedId: null,
        error: null,
        loading: false,
        isSelecting: false,
        isOpen: false,
        showMinCharsHelper: false,
      };
    case "selectStart":
      return { ...state, selectedId: action.id, isSelecting: true };
    case "selectEnd":
      return { ...state, isSelecting: false };
    case "clearAll":
      return {
        ...state,
        query: "",
        suggestions: [],
        highlightedIndex: -1,
        selectedId: null,
        error: null,
        loading: false,
        isSelecting: false,
        isOpen: false,
        showMinCharsHelper: false,
      };
    default:
      return state;
  }
}

export default function SearchForm({
  placeholder,
  mobilePlaceholder,
  name = "query",
  onCardSelect,
  variant = "default",
}: SearchFormProps) {
  const { t } = useI18nHelpers();
  const pathname = usePathname();
  const router = useRouter();
  const locale = getLocaleFromPathname(pathname) ?? defaultLocale;
  const [state, dispatch] = useReducer(reducer, initialState);
  const resolvedPlaceholder = state.isMobile
    ? mobilePlaceholder ?? t("search.placeholder_mobile")
    : placeholder ?? t("search.placeholder");
  const {
    query,
    suggestions,
    loading,
    error,
    selectedId,
    isSelecting,
    highlightedIndex,
    isOpen,
    showMinCharsHelper,
  } = state;
  const [isNavigating, startTransition] = useTransition();
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const helperRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isHeader = variant === "header";
  const isBlocked = isNavigating || isSelecting;

  const clearTimers = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (helperRef.current) clearTimeout(helperRef.current);
    abortRef.current?.abort();
  }, []);

  const closeSuggestions = useCallback(
    (options?: { clear?: boolean }) => {
      clearTimers();
      dispatch({ type: "closeSuggestions", clear: options?.clear });
    },
    [clearTimers]
  );

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 1) {
      clearTimers();
      dispatch({ type: "resetForEmptyQuery" });
      return;
    }

    if (trimmed.length < 3) {
      clearTimers();
      dispatch({ type: "resetForShortQuery" });
      helperRef.current = setTimeout(() => {
        dispatch({ type: "setShowMinCharsHelper", value: true });
      }, DEBOUNCED_SEARCH_TIMER);
      return;
    }

    dispatch({ type: "setShowMinCharsHelper", value: false });
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(trimmed);
    }, DEBOUNCED_SEARCH_TIMER);

    return () => {
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  async function fetchSuggestions(value: string) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    dispatch({ type: "fetchStart" });

    try {
      const res = await fetch(
        `/api/cards/search?q=${encodeURIComponent(value)}`,
        {
          signal: controller.signal,
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message = body?.error ?? t("search.error_default");
        throw new Error(message);
      }

      const data = await res.json();
      dispatch({ type: "fetchSuccess", items: data.items ?? [] });
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        dispatch({ type: "fetchAbort" });
        return;
      }
      dispatch({
        type: "fetchError",
        message: (err as Error).message,
      });
    }
  }

  function navigateToCard(card: Card) {
    const setId = card.set?.set_id;
    const collector = card.collector_number ?? null;

    if (setId && collector !== null) {
      startTransition(() => {
        router.push(`/${locale}/cards/${setId}-${collector}`);
      });
      return true;
    }
    return false;
  }

  async function handleSelect(card: Card) {
    if (isBlocked) return;
    dispatch({ type: "selectStart", id: card.id });
    dispatch({ type: "setQuery", value: "" });
    closeSuggestions({ clear: true });
    try {
      await Promise.resolve(onCardSelect?.(card));
    } catch {
      dispatch({ type: "selectEnd" });
      return;
    }
    const didNavigate = navigateToCard(card);
    if (!didNavigate) {
      dispatch({ type: "selectEnd" });
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isBlocked) return;
    if (highlightedIndex < 0 || highlightedIndex >= suggestions.length) return;
    void handleSelect(suggestions[highlightedIndex]);
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (isBlocked) {
      event.preventDefault();
      return;
    }
    if (event.key === "Escape") {
      closeSuggestions();
      return;
    }
    if (suggestions.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!isOpen) {
        dispatch({ type: "setOpen", value: true });
        dispatch({ type: "setHighlightedIndex", value: 0 });
        return;
      }
      dispatch({
        type: "setHighlightedIndex",
        value:
          highlightedIndex + 1 >= suggestions.length ? 0 : highlightedIndex + 1,
      });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen) {
        dispatch({ type: "setOpen", value: true });
        dispatch({
          type: "setHighlightedIndex",
          value: suggestions.length - 1,
        });
        return;
      }
      dispatch({
        type: "setHighlightedIndex",
        value:
          highlightedIndex - 1 < 0
            ? suggestions.length - 1
            : highlightedIndex - 1,
      });
    } else if (event.key === "Enter") {
      event.preventDefault();
    if (
        isOpen &&
        highlightedIndex >= 0 &&
        highlightedIndex < suggestions.length
      ) {
        void handleSelect(suggestions[highlightedIndex]);
      }
    }
  }

  const showSuggestions = isOpen && suggestions.length > 0;

  function handleClear() {
    if (isBlocked) return;
    dispatch({ type: "clearAll" });
    clearTimers();
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

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(max-width: 639px)");
    const handleChange = (event: MediaQueryListEvent) => {
      dispatch({ type: "setMobile", value: event.matches });
    };
    dispatch({ type: "setMobile", value: mediaQuery.matches });
    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <form
      className={cn(
        "relative w-full",
        isBlocked && "pointer-events-none opacity-60"
      )}
      role="search"
      action="#"
      method="get"
      onSubmit={handleSubmit}
      autoComplete="off"
      aria-busy={loading || isNavigating}
      aria-disabled={isBlocked}
      ref={formRef}
    >
      <label className="sr-only" htmlFor="search-input">
        {t("search.label")}
      </label>
      <div
        className={`relative flex items-center rounded-sm border shadow-(--shadow) transition ${
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
          placeholder={resolvedPlaceholder}
          className={`h-full w-full border-0 bg-transparent text-(--text-primary) placeholder:text-slate-400 focus:outline-none ${
            isHeader ? "pl-8 pr-11 text-sm" : "pl-10 pr-12 text-base"
          }`}
          value={query}
          ref={inputRef}
          disabled={isBlocked}
          onChange={(event) => {
            const nextValue = event.target.value;
            dispatch({ type: "setQuery", value: nextValue });
            if (nextValue.trim().length >= 3) {
              dispatch({ type: "setOpen", value: true });
            }
          }}
          aria-controls="card-suggestions"
          aria-expanded={showSuggestions}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              dispatch({ type: "setOpen", value: true });
            }
          }}
        />
        {query.length > 0 && (
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={t("search.clear")}
            onClick={handleClear}
            disabled={isBlocked}
            className="bg-transparent border-0 text-white/60"
          >
            <CircleX className="size-5" />
          </Button>
        )}
        <span
          className={`absolute right-11 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-border border-t-accent transition-opacity duration-100 ${
            loading || isSelecting || isNavigating
              ? "opacity-100 animate-spin"
              : "opacity-0"
          }`}
          aria-hidden="true"
        />
      </div>

      {error ? (
        <p
          className={cn(
            "text-sm text-(--text-muted)",
            isHeader
              ? "absolute left-0 right-0 top-full z-50 mt-2 rounded-sm border border-border bg-(--panel) px-3 py-2 shadow-(--shadow)"
              : "mt-2"
          )}
          role="status"
        >
          {error}
        </p>
      ) : null}

      {!error && showMinCharsHelper ? (
        <p
          className={cn(
            "text-sm text-(--text-muted)",
            isHeader
              ? "absolute left-0 right-0 top-full z-50 mt-2 rounded-sm border border-border bg-(--panel) px-3 py-2 shadow-(--shadow)"
              : "mt-2"
          )}
          role="status"
        >
          {t("search.min_chars")}
        </p>
      ) : null}

      {showSuggestions && (
        <ul
          id="card-suggestions"
          className={cn(
            "list-none w-full rounded-sm border border-border bg-(--panel) p-2 shadow-(--shadow)",
            isHeader
              ? "absolute left-0 right-0 top-full z-50 mt-2 flex flex-col gap-1"
              : "mt-2 flex flex-col gap-1"
          )}
          role="listbox"
          aria-label={t("search.suggestions_aria")}
        >
          {suggestions.map((card, index) => {
            const isActive = index === highlightedIndex;

            return (
              <li
                key={card.id}
                role="option"
                aria-selected={isActive || card.id === selectedId}
                onMouseEnter={() =>
                  dispatch({ type: "setHighlightedIndex", value: index })
                }
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

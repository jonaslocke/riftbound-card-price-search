"use client";

import SearchForm from "@/app/components/SearchForm";
import { Card } from "@/app/types/card.schemas";
import { trackEvent } from "@/lib/analytics";
import { useSession } from "next-auth/react";
import type { ComponentProps } from "react";
import { useEffect, useRef } from "react";

const DEBOUNCE_MS = 700;
const SEARCH_SOURCE = "search_bar";

type SearchFormWithAnalyticsProps = ComponentProps<typeof SearchForm>;

type SelectionInfo = {
  method: "click" | "keyboard";
  position: number;
};

export default function SearchFormWithAnalytics(
  props: SearchFormWithAnalyticsProps
) {
  const { data: session } = useSession();
  const userId = session?.user?.email ?? null;
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputValueRef = useRef("");
  const inputMethodRef = useRef<"typing" | "paste">("typing");
  const wasPasteRef = useRef(false);
  const selectionRef = useRef<SelectionInfo | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const scheduleSearchStart = (value: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (value.trim().length < 3) return;
      debounceRef.current = setTimeout(() => {
        trackEvent(
          "search_started",
          {
            query: value.trim(),
            input_method: inputMethodRef.current,
            source: SEARCH_SOURCE,
          },
          { user_id: userId }
        );
      }, DEBOUNCE_MS);
    };

    const handleInput = (event: Event) => {
      const target = event.target as HTMLInputElement | null;
      if (!target || target.tagName !== "INPUT") return;
      inputValueRef.current = target.value;
      if (wasPasteRef.current) {
        inputMethodRef.current = "paste";
        wasPasteRef.current = false;
      } else {
        inputMethodRef.current = "typing";
      }
      scheduleSearchStart(target.value);
    };

    const handlePaste = () => {
      wasPasteRef.current = true;
    };

    const handleClickCapture = (event: Event) => {
      const target = event.target as Element | null;
      if (!target) return;
      const list = wrapper.querySelector("#card-suggestions");
      if (!list) return;
      const item = target.closest("li");
      if (!item || !list.contains(item)) return;
      const index = Array.from(list.children).indexOf(item);
      if (index < 0) return;
      selectionRef.current = { method: "click", position: index };
    };

    const handleKeyDownCapture = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (keyboardEvent.key !== "Enter") return;
      const target = keyboardEvent.target as Element | null;
      if (!target || target.tagName !== "INPUT") return;
      const list = wrapper.querySelector("#card-suggestions");
      if (!list) return;
      const activeItem =
        list.querySelector("li[aria-selected='true']") ??
        list.querySelector('li[aria-selected="true"]');
      if (!activeItem) return;
      const index = Array.from(list.children).indexOf(activeItem);
      if (index < 0) return;
      selectionRef.current = { method: "keyboard", position: index };
    };

    wrapper.addEventListener("input", handleInput, true);
    wrapper.addEventListener("paste", handlePaste, true);
    wrapper.addEventListener("click", handleClickCapture, true);
    wrapper.addEventListener("keydown", handleKeyDownCapture, true);

    return () => {
      wrapper.removeEventListener("input", handleInput, true);
      wrapper.removeEventListener("paste", handlePaste, true);
      wrapper.removeEventListener("click", handleClickCapture, true);
      wrapper.removeEventListener("keydown", handleKeyDownCapture, true);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleCardSelect = async (card: Card) => {
    const selection = selectionRef.current ?? {
      method: "click",
      position: 0,
    };
    selectionRef.current = null;
    const analyticsCardId = card.riftbound_id ?? card.id;
    trackEvent(
      "card_selected",
      {
        query: inputValueRef.current.trim(),
        card_id: analyticsCardId,
        card_name: card.name,
        selection_method: selection.method,
        position: selection.position,
      },
      { user_id: userId }
    );
    await Promise.resolve(props.onCardSelect?.(card));
  };

  return (
    <div ref={wrapperRef} className="w-full">
      <SearchForm {...props} onCardSelect={handleCardSelect} />
    </div>
  );
}

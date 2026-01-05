import type { Card } from "@/app/types/card.schemas";
import { compareCards } from "./compareCards";
import { getCardGroupKey } from "./getCardGroupKey";

export const pickPrimaryPrints = (cards: Card[]) => {
  const grouped = new Map<string, Card>();
  for (const card of cards) {
    const key = getCardGroupKey(card);
    const existing = grouped.get(key);
    if (!existing || compareCards(card, existing) < 0) {
      grouped.set(key, card);
    }
  }

  return Array.from(grouped.values()).sort(compareCards);
};

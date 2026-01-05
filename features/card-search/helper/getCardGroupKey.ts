import type { Card } from "@/app/types/card.schemas";
import { normalizeKey } from "./normalizeKey";

export const getCardGroupKey = (card: Card) => {
  const base = card.metadata?.clean_name ?? card.name ?? "";
  return normalizeKey(base);
};

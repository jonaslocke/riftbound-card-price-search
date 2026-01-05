import type { Card } from "@/app/types/card.schemas";

export const isPrimaryPrint = (card: Card) =>
  !card.metadata?.alternate_art &&
  !card.metadata?.overnumbered &&
  !card.metadata?.signature;

import type { Card } from "@/app/types/card.schemas";
import { getSetOrderIndex } from "@/lib/set-order";
import { isPrimaryPrint } from "./isPrimaryPrint";

export const compareCards = (a: Card, b: Card) => {
  const setOrder =
    getSetOrderIndex(a.set?.set_id) - getSetOrderIndex(b.set?.set_id);
  if (setOrder !== 0) return setOrder;

  const primaryOrder = Number(!isPrimaryPrint(a)) - Number(!isPrimaryPrint(b));
  if (primaryOrder !== 0) return primaryOrder;

  const collectorA = Number.isFinite(a.collector_number)
    ? (a.collector_number as number)
    : Number.MAX_SAFE_INTEGER;
  const collectorB = Number.isFinite(b.collector_number)
    ? (b.collector_number as number)
    : Number.MAX_SAFE_INTEGER;
  if (collectorA !== collectorB) return collectorA - collectorB;

  const codeA = (a.public_code ?? a.riftbound_id ?? a.name ?? "").toUpperCase();
  const codeB = (b.public_code ?? b.riftbound_id ?? b.name ?? "").toUpperCase();
  return codeA.localeCompare(codeB);
};

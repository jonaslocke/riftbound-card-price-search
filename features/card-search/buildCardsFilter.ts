import type { Card } from "@/app/types/card.schemas";
import type { Filter } from "mongodb";
import { BOOL_FILTERS, IN_FILTERS } from "./constants";
import type { AdvancedSearchQuery } from "./types";

export function buildCardsFilter(query: AdvancedSearchQuery): Filter<Card> {
  const filter: Filter<Card> = {};

  for (const [key, path] of IN_FILTERS) {
    const value = query[key];
    if (value?.length)
      (filter as Record<string, unknown>)[path] = { $in: value };
  }

  for (const [key, path] of BOOL_FILTERS) {
    const value = query[key];
    if (value !== undefined) (filter as Record<string, unknown>)[path] = value;
  }

  if (query.q) filter.$text = { $search: query.q };

  return filter;
}

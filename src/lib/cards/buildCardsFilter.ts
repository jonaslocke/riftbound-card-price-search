import { Card } from "@/app/types/card.schemas";
import type { AdvancedSearchQuery } from "@/src/lib/cards/advanced-search.schema";
import type { Filter } from "mongodb";

const IN_FILTERS = [
  ["sets", "set.set_id"],
  ["types", "classification.type"],
  ["supertypes", "classification.supertype"],
  ["rarities", "classification.rarity"],
  ["domains", "classification.domain"],
  ["keywords", "keywords"],
] as const;

const BOOL_FILTERS = [
  ["alternateArt", "metadata.alternate_art"],
  ["overNumbered", "metadata.overnumbered"],
  ["signature", "metadata.signature"],
] as const;

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

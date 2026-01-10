import type { Card } from "@/app/types/card.schemas";
import type { Filter } from "mongodb";
import { BOOL_FILTERS, IN_FILTERS } from "./constants";
import type { AdvancedSearchQuery } from "./types";

function escapeRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeAlnum(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function buildPunctuationInsensitiveRegex(q: string): RegExp | null {
  const n = normalizeAlnum(q);
  if (n.length < 3) return null;
  const pattern = n.split("").map(escapeRegex).join("[^a-z0-9]*");
  return new RegExp(pattern, "i");
}

function buildSubstringRegex(q: string): RegExp | null {
  const s = q.trim();
  if (s.length < 2) return null;
  return new RegExp(escapeRegex(s), "i");
}

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

  if (query.q) {
    const q = query.q.trim();
    const ors: Filter<Card>[] = [];

    const substring = buildSubstringRegex(q);
    if (substring) ors.push({ name: { $regex: substring } });

    const punctInsensitive = buildPunctuationInsensitiveRegex(q);
    if (punctInsensitive) ors.push({ name: { $regex: punctInsensitive } });

    if (ors.length) {
      (filter as Record<string, unknown>).$and = [
        ...(((filter as Record<string, unknown>).$and as unknown[]) ?? []),
        { $or: ors },
      ];
    }
  }

  return filter;
}

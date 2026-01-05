import {
  CardDomainSchema,
  CardKeywordSchema,
  CardRaritySchema,
  CardSupertypeSchema,
  CardTypeSchema,
  SetsSchema,
} from "@/app/types/card.schemas";
import { z } from "zod";

const splitCsv = (v: unknown) => {
  if (typeof v !== "string") return undefined;
  const arr = v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return arr.length ? arr : undefined;
};

const boolFromString = (v: unknown) => {
  if (v === undefined) return undefined;
  if (typeof v === "boolean") return v;
  if (typeof v !== "string") return undefined;

  const s = v.toLowerCase().trim();
  if (["true", "1", "yes", "y"].includes(s)) return true;
  if (["false", "0", "no", "n"].includes(s)) return false;
  return undefined;
};

const numberFromParam = (v: unknown) => {
  if (v === undefined || v === null || v === "") return undefined;
  if (typeof v === "number") return v;
  if (typeof v === "string") return Number(v);
  return undefined;
};

export const advancedSearchQuerySchema = z.object({
  // multi-select filters
  domains: z.preprocess(splitCsv, z.array(CardDomainSchema).optional()),
  sets: z.preprocess(splitCsv, z.array(SetsSchema).optional()),
  types: z.preprocess(splitCsv, z.array(CardTypeSchema).optional()),
  supertypes: z.preprocess(splitCsv, z.array(CardSupertypeSchema).optional()),
  rarities: z.preprocess(splitCsv, z.array(CardRaritySchema).optional()),
  keywords: z.preprocess(splitCsv, z.array(CardKeywordSchema).optional()),

  // text search (name only via $text)
  q: z.string().trim().min(1).max(120).optional(),

  // metadata booleans
  alternateArt: z.preprocess(boolFromString, z.boolean().optional()),
  overNumbered: z.preprocess(boolFromString, z.boolean().optional()),
  signature: z.preprocess(boolFromString, z.boolean().optional()),

  // pagination
  page: z.preprocess(numberFromParam, z.number().int().min(1).default(1)),
  limit: z.preprocess(
    numberFromParam,
    z.number().int().min(1).max(100).default(24)
  ),

  // sorting
  sort: z.enum(["relevance", "name"]).default("relevance"),
  order: z.enum(["asc", "desc"]).default("asc"),
});

export type AdvancedSearchQuery = z.infer<typeof advancedSearchQuerySchema>;

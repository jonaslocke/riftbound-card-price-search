import {
  CardDomainSchema,
  CardKeywordSchema,
  CardRaritySchema,
  CardSupertypeSchema,
  CardTypeDisplaySchema,
  CardTypeSchema,
  SetsSchema,
} from "@/app/types/card.schemas";
import { z } from "zod";
import { boolFromString } from "./helper/boolFromString";
import { numberFromParam } from "./helper/numberFromParam";
import { splitCsv } from "./helper/splitCsv";

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

export const CardDetailsDtoSchema = z.object({
  riftboundId: z.string().min(1),
  name: z.string().min(1),
  imageUrl: z.string().min(1),
  imageThumbnailUrl: z.string().min(1),
  type: CardTypeDisplaySchema,
  rarity: CardRaritySchema,
  domains: z.array(CardDomainSchema),
  setLabel: z.string().min(1),
  normalizedCardNumber: z.string().min(1),
  energy: z.number().int().nullable(),
  power: z.number().int().nullable(),
  might: z.number().int().nullable(),
  description: z.string(),
  descriptionPlain: z.string(),
  artist: z.string().min(1),
  artistLabel: z.string().min(1),
  tags: z.array(z.string()),
  keywords: z.array(CardKeywordSchema),
  isAlteredArt: z.boolean(),
  isOverNumbered: z.boolean(),
  isSignature: z.boolean(),
  cardNumber: z.number().int().nonnegative().min(1),
});

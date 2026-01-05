import { z } from "zod";

export const SETS = ["OGN", "OGS", "SFD"] as const;
export const SetsSchema = z.enum(SETS);
export type Sets = z.infer<typeof SetsSchema>;

export const CARD_DOMAINS = [
  "body",
  "calm",
  "chaos",
  "fury",
  "mind",
  "order",
  "colorless",
] as const;
export const CardDomainSchema = z.enum(CARD_DOMAINS);
export type CardDomain = z.infer<typeof CardDomainSchema>;

export const CARD_TYPES = [
  "battlefield",
  "gear",
  "legend",
  "rune",
  "spell",
  "unit",
] as const;
export const CardTypeSchema = z.enum(CARD_TYPES);
export type CardType = z.infer<typeof CardTypeSchema>;

export const CARD_SUPERTYPES = [
  "champion",
  "signature",
  "token",
  "basic",
] as const;
export const CardSupertypeSchema = z.enum(CARD_SUPERTYPES);
export type CardSupertype = z.infer<typeof CardSupertypeSchema>;

export const CARD_RARITIES = [
  "common",
  "epic",
  "rare",
  "showcase",
  "uncommon",
] as const;
export const CardRaritySchema = z.enum(CARD_RARITIES);
export type CardRarity = z.infer<typeof CardRaritySchema>;

export const CARD_KEYWORDS = [
  "accelerate",
  "action",
  "add",
  "assault",
  "deathknell",
  "deflect",
  "equip",
  "ganking",
  "hidden",
  "legion",
  "mighty",
  "quick-draw",
  "reaction",
  "repeat",
  "shield",
  "tank",
  "temporary",
  "vision",
  "weaponmaster",
] as const;
export const CardKeywordSchema = z.enum(CARD_KEYWORDS);
export type CardKeyword = z.infer<typeof CardKeywordSchema>;

export const CARD_ORIENTATION = ["portrait", "landscape"] as const;
export const CardOrientationSchema = z.enum(CARD_ORIENTATION);
export type CardOrientation = z.infer<typeof CardOrientationSchema>;

/*
CardDomain, CardType, CardSuperType and CardRarity are in .jsons with capitalized values
but on the ingestion we will make them lowercase
*/

export const CardSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  riftbound_id: z.string().min(1),
  tcgplayer_id: z.string().min(1).nullable(),
  ligamagic_id: z.string().min(1).nullable(),
  public_code: z.string().min(1),
  collector_number: z.number().int().nonnegative(),
  attributes: z.object({
    energy: z.number().int().nullable(),
    might: z.number().int().nullable(),
    power: z.number().int().nullable(),
  }),
  classification: z.object({
    type: CardTypeSchema,
    supertype: CardSupertypeSchema.nullable(),
    rarity: CardRaritySchema,
    domain: z.array(CardDomainSchema),
  }),
  text: z.object({
    rich: z.string(),
    plain: z.string(),
  }),
  set: z.object({
    set_id: SetsSchema,
    label: z.string().min(1),
  }),
  media: z.object({
    image_url: z.string().url(),
    artist: z.string().min(1),
    accessibility_text: z.string().min(1),
  }),
  tags: z.array(z.string()),
  keywords: z.array(CardKeywordSchema).default([]),
  orientation: CardOrientationSchema,
  metadata: z.object({
    clean_name: z.string().min(1),
    alternate_art: z.boolean(),
    overnumbered: z.boolean(),
    signature: z.boolean(),
  }),
  is_primary: z.boolean().optional(),
});

type BaseCard = z.infer<typeof CardSchema>;

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Card = Prettify<
  BaseCard & {
    other_printings?: BaseCard[];
  }
>;

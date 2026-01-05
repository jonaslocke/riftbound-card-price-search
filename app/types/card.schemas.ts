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

import path from "path";
import type { FacetDef, FacetsDto } from "./types";

export const CARD_SEARCH_DATA_DIR = path.join(process.cwd(), "data", "sets");
export const CARD_SEARCH_MIN_SIZE = 10;
export const CARD_SEARCH_MAX_SIZE = 100;

export const IN_FILTERS = [
  ["sets", "set.set_id"],
  ["types", "classification.type"],
  ["supertypes", "classification.supertype"],
  ["rarities", "classification.rarity"],
  ["domains", "classification.domain"],
  ["keywords", "keywords"],
] as const;

export const BOOL_FILTERS = [
  ["alternateArt", "metadata.alternate_art"],
  ["overNumbered", "metadata.overnumbered"],
  ["signature", "metadata.signature"],
] as const;

export const FACET_DEFS: FacetDef[] = [
  { name: "sets", path: "set.set_id" },
  { name: "types", path: "classification.type" },
  { name: "supertypes", path: "classification.supertype" },
  { name: "rarities", path: "classification.rarity" },

  // arrays -> unwind for per-value buckets
  { name: "domains", path: "classification.domain", unwind: true },
  { name: "keywords", path: "keywords", unwind: true },

  // booleans
  { name: "alternateArt", path: "metadata.alternate_art" },
  { name: "overNumbered", path: "metadata.overnumbered" },
  { name: "signature", path: "metadata.signature" },
];

export const EMPTY_FACETS: FacetsDto = {
  sets: [],
  types: [],
  supertypes: [],
  rarities: [],
  domains: [],
  keywords: [],
  alternateArt: [],
  overNumbered: [],
  signature: [],
};

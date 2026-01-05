import type { Card } from "@/app/types/card.schemas";
import { z } from "zod";
import {
  CardDetailsDtoSchema,
  advancedSearchQuerySchema,
} from "./card-search.schemas";

export type AdvancedSearchQuery = z.infer<typeof advancedSearchQuerySchema>;
export type CardDetailsDto = z.infer<typeof CardDetailsDtoSchema>;

export type FacetDef = {
  name: string;
  path: string;
  unwind?: boolean;
};

export type FacetBucket = { _id: string | boolean | null; count: number };

export type FacetsDto = {
  sets: FacetBucket[];
  types: FacetBucket[];
  supertypes: FacetBucket[];
  rarities: FacetBucket[];
  domains: FacetBucket[];
  keywords: FacetBucket[];
  alternateArt: FacetBucket[];
  overNumbered: FacetBucket[];
  signature: FacetBucket[];
};

export type AdvancedSearchResponse = {
  items: CardDetailsDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  facets: FacetsDto;
};

export type SearchResponse = {
  items: Card[];
  total: number;
  page: number;
  size: number;
  pages: number;
};

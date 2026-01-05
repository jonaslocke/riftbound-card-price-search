import {
  advancedSearchQuerySchema,
  type AdvancedSearchQuery,
} from "@/src/lib/cards/advanced-search.schema";
import { buildCardsFilter } from "@/src/lib/cards/buildCardsFilter";
import { buildFacetStages, type FacetsDto } from "@/src/lib/cards/facets";
import type { Document } from "mongodb";
import { NextResponse } from "next/server";

import { Card } from "@/app/types/card.schemas";
import { getCollections } from "@/lib/mongodb/collections";
import {
  CardDetailsDto,
  toCardDetailsDto,
} from "@/src/lib/cards/card-details-dto";

export const runtime = "nodejs";

type AdvancedSearchResponse = {
  items: CardDetailsDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  facets: FacetsDto;
};

function buildSort(query: AdvancedSearchQuery): Document {
  if (query.sort === "relevance" && query.q) {
    return { score: { $meta: "textScore" }, name: 1 };
  }

  const dir = query.order === "desc" ? -1 : 1;
  return { name: dir };
}

const EMPTY_FACETS: FacetsDto = {
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

export async function GET(req: Request) {
  const url = new URL(req.url);

  const parsed = advancedSearchQuerySchema.safeParse(
    Object.fromEntries(url.searchParams.entries())
  );

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query params", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const query = parsed.data;
  const { cards } = await getCollections();

  const filter = buildCardsFilter(query);

  const skip = (query.page - 1) * query.limit;

  const pipeline: Document[] = [
    { $match: filter },

    ...(query.q ? [{ $addFields: { score: { $meta: "textScore" } } }] : []),

    {
      $facet: {
        items: [
          { $sort: buildSort(query) },
          { $skip: skip },
          { $limit: query.limit },
        ],
        total: [{ $count: "value" }],
        facets: [
          {
            $facet: buildFacetStages(),
          },
        ],
      },
    },
  ];

  const [result] = await cards.aggregate(pipeline).toArray();

  const total = (result?.total?.[0]?.value as number | undefined) ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / query.limit));
  const page = Math.min(query.page, totalPages);

  const items = ((result?.items ?? []) as Card[]).map(toCardDetailsDto);

  const facets = (result?.facets?.[0] as FacetsDto | undefined) ?? EMPTY_FACETS;

  const response: AdvancedSearchResponse = {
    items,
    page,
    limit: query.limit,
    total,
    totalPages,
    facets,
  };

  return NextResponse.json(response);
}

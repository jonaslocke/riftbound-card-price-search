import type { Collection } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { CardPricesResponse } from "@/lib/prices/schema";

export interface CardPriceDoc extends CardPricesResponse {
  cachedAt: Date;
  riftboundId: string;
  cardName: string;
}

const COLLECTIONS = {
  cardPrices: "card_price_cache",
} as const;

type Collections = {
  cardPrices: Collection<CardPriceDoc>;
};

export async function getCollections(): Promise<Collections> {
  const db = await getDb();
  return {
    cardPrices: db.collection<CardPriceDoc>(COLLECTIONS.cardPrices),
  };
}

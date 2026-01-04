import type { Collection } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { AnalyticsEvent } from "@/lib/analytics/schema";
import type { CardPricesResponse } from "@/lib/prices/schema";

export interface CardPriceDoc extends CardPricesResponse {
  cachedAt: Date;
  riftboundId: string;
  cardName: string;
}

export type AnalyticsEventDoc = AnalyticsEvent & {
  received_at: string;
};

const COLLECTIONS = {
  cardPrices: "card_price_cache",
  analyticsEvents: "analytics_events",
} as const;

type Collections = {
  cardPrices: Collection<CardPriceDoc>;
  analyticsEvents: Collection<AnalyticsEventDoc>;
};

export async function getCollections(): Promise<Collections> {
  const db = await getDb();
  return {
    cardPrices: db.collection<CardPriceDoc>(COLLECTIONS.cardPrices),
    analyticsEvents: db.collection<AnalyticsEventDoc>(COLLECTIONS.analyticsEvents),
  };
}

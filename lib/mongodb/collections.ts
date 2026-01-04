import type { Collection } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { AnalyticsEvent } from "@/lib/analytics/schema";
import type { CardPricesResponse } from "@/lib/prices/schema";
import type { User } from "@/lib/users/schema";

export interface CardPriceDoc extends CardPricesResponse {
  cachedAt: Date;
  riftboundId: string;
  cardName: string;
}

export type AnalyticsEventDoc = AnalyticsEvent & {
  received_at: string;
};

export type UserDoc = User;

const COLLECTIONS = {
  cardPrices: "card_price_cache",
  analyticsEvents: "analytics_events",
  users: "users",
} as const;

type Collections = {
  cardPrices: Collection<CardPriceDoc>;
  analyticsEvents: Collection<AnalyticsEventDoc>;
  users: Collection<UserDoc>;
};

export async function getCollections(): Promise<Collections> {
  const db = await getDb();
  return {
    cardPrices: db.collection<CardPriceDoc>(COLLECTIONS.cardPrices),
    analyticsEvents: db.collection<AnalyticsEventDoc>(COLLECTIONS.analyticsEvents),
    users: db.collection<UserDoc>(COLLECTIONS.users),
  };
}

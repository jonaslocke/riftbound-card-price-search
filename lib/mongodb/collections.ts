import { Card } from "@/app/types/card.schemas";
import type { User } from "@/features/authentication/schema";
import type { AnalyticsEvent } from "@/lib/analytics/schema";
import { getDb } from "@/lib/mongodb";
import type { CardPricesResponse } from "@/lib/prices/schema";
import type { Collection } from "mongodb";

export interface CardPriceDoc extends CardPricesResponse {
  cachedAt: Date;
  riftboundId: string;
  cardName: string;
}

export type AnalyticsEventDoc = AnalyticsEvent & {
  received_at: string;
};

export type UserDoc = User;

export type CardsDoc = Card;

const COLLECTIONS = {
  cardPrices: "card_price_cache",
  analyticsEvents: "analytics_events",
  users: "users",
  cards: "cards",
} as const;

type Collections = {
  cardPrices: Collection<CardPriceDoc>;
  analyticsEvents: Collection<AnalyticsEventDoc>;
  users: Collection<UserDoc>;
  cards: Collection<CardsDoc>;
};

export async function getCollections(): Promise<Collections> {
  const db = await getDb();
  return {
    cardPrices: db.collection<CardPriceDoc>(COLLECTIONS.cardPrices),
    analyticsEvents: db.collection<AnalyticsEventDoc>(
      COLLECTIONS.analyticsEvents
    ),
    users: db.collection<UserDoc>(COLLECTIONS.users),
    cards: db.collection<CardsDoc>(COLLECTIONS.cards),
  };
}

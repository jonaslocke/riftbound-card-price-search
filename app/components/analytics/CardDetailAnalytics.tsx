"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import { useSession } from "next-auth/react";

export interface CardPriceStoreDto {
  storeName: string;
  storeUrl: string;
  storeTitle: string;
  storeImage: string | null;
  cardUrl: string | null;
  quantity: number;
  currentPrice: number;
  lastKnownPrice: number | null;
  currency: "brl" | "usd";
  error?: string;
}

export interface CardPricesResponseDto {
  set: string;
  number: number;
  inStockStores: number;
  stores: CardPriceStoreDto[];
  lastKnownUpdate: string | null;
  lastUpdated: string;
}

type CardDetailAnalyticsProps = {
  cardId: string;
  cardName: string;
  authState: "anonymous" | "authenticated";
  prices: CardPricesResponseDto | null;
};

export default function CardDetailAnalytics({
  cardId,
  cardName,
  authState,
  prices,
}: CardDetailAnalyticsProps) {
  const { data: session } = useSession();
  const userId = session?.user?.email ?? null;
  const lastViewKeyRef = useRef<string | null>(null);
  const lastPricesKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (authState === "authenticated" && !userId) return;
    const viewKey = `${cardId}:${authState}:${userId ?? "anon"}`;
    if (lastViewKeyRef.current !== viewKey) {
      lastViewKeyRef.current = viewKey;
      trackEvent(
        "card_detail_viewed",
        {
          card_id: cardId,
          card_name: cardName,
          auth_state: authState,
        },
        { user_id: userId }
      );
    }
  }, [cardId, cardName, authState, userId]);

  useEffect(() => {
    if (!prices) return;
    if (authState === "authenticated" && !userId) return;
    const stores = prices.stores ?? [];
    const pricesKey = `${cardId}:${stores.length}:${prices.inStockStores}:${
      userId ?? "anon"
    }`;
    if (lastPricesKeyRef.current === pricesKey) return;
    lastPricesKeyRef.current = pricesKey;
    trackEvent(
      "prices_shown",
      {
        card_id: cardId,
        card_name: cardName,
        stores: stores.map((store, index) => ({
          store_id: store.storeName,
          store_name: store.storeTitle || store.storeName,
          price: store.currentPrice,
          currency: store.currency,
          quantity: store.quantity,
          position: index,
        })),
        price_count: stores.length,
      },
      { user_id: userId }
    );
  }, [cardId, prices, authState, userId]);

  return null;
}

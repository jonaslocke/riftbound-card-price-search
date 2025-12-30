"use client";

import { useCallback, type MouseEvent } from "react";
import type { CardPriceStoreDto } from "@/app/types/card";
import CardListingItem from "@/app/components/card-listing/CardListingItem";
import { trackEvent } from "@/lib/analytics";
import { useSession } from "next-auth/react";

type CardListingItemWithAnalyticsProps = Omit<CardPriceStoreDto, "currency"> & {
  cardId: string;
  cardName: string;
  position: number;
  currency?: "BRL" | "USD";
  variant?: "default" | "highlighted";
};

export default function CardListingItemWithAnalytics({
  cardId,
  cardName,
  position,
  currency,
  storeName,
  storeTitle,
  storeUrl,
  cardUrl,
  quantity,
  price,
  variant,
  storeImage,
}: CardListingItemWithAnalyticsProps) {
  const { data: session } = useSession();
  const userId = session?.user?.email ?? null;
  const displayTitle = storeTitle || storeName;

  const handleClickCapture = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const target = event.target as Element | null;
      if (!target) return;
      const anchor = target.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !cardUrl || href !== cardUrl) return;
      trackEvent("store_clicked", {
        card_id: cardId,
        card_name: cardName,
        store_id: storeName,
        store_name: displayTitle,
        price,
        currency: currency ?? "BRL",
        quantity,
        position,
      }, { user_id: userId });
    },
    [cardId, storeName, displayTitle, price, currency, quantity, position, cardUrl]
  );

  return (
    <div onClick={handleClickCapture}>
      <CardListingItem
        storeName={storeName}
        storeTitle={storeTitle}
        storeImage={storeImage}
        storeUrl={storeUrl}
        cardUrl={cardUrl}
        quantity={quantity}
        price={price}
        currency={currency}
        variant={variant}
      />
    </div>
  );
}

"use client";

import { useI18nHelpers } from "@/app/i18n/HelpersProvider";
import { CardPriceStoreDto } from "@/app/types/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ExternalLinkIcon,
  MinusIcon,
  SparklesIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { FC, MouseEvent, useCallback } from "react";

type CardListingItemProps = Omit<CardPriceStoreDto, "currency"> & {
  variant?: "default" | "highlighted";
  currency?: "BRL" | "USD";
  lastKnownUpdate?: string | null;
  onClick: (event: MouseEvent<HTMLDivElement>) => void;
};

type Trend = "new" | "up" | "down" | "stable";

const getPricesTrend = (
  currentPrice: number,
  lastKnownPrice: number | null
) => {
  const trend =
    lastKnownPrice === null
      ? "new"
      : currentPrice > lastKnownPrice
      ? "up"
      : currentPrice < lastKnownPrice
      ? "down"
      : "stable";

  const delta = lastKnownPrice === null ? null : currentPrice - lastKnownPrice;

  return {
    trend: trend as Trend,
    delta,
  };
};

const trendColor: Record<Trend, string> = {
  up: "text-rose-600 border-rose-600",
  new: "text-emerald-600 border-emerald-600",
  stable: "border-black/40",
  down: "text-emerald-600 border-emerald-600",
};

const TrendIcon: FC<{ trend: Trend }> = ({ trend }) => {
  const classes = cn(
    "flex justify-center items-center bg-white/20 border rounded size-4 sm:size-5 *:size-3",
    trendColor[trend]
  );
  switch (trend) {
    case "new":
      return (
        <div className={cn(classes)}>
          <SparklesIcon />
        </div>
      );
    case "up":
      return (
        <div className={cn(classes)}>
          <TrendingUp />
        </div>
      );
    case "down":
      return (
        <div className={cn(classes)}>
          <TrendingDown />
        </div>
      );
    default:
      return (
        <div className={cn(classes)}>
          <MinusIcon />
        </div>
      );
  }
};

export default function CardListingItem({
  currentPrice,
  quantity,
  storeName,
  storeTitle,
  storeImage,
  storeUrl,
  cardUrl,
  lastKnownPrice,
  variant = "default",
  currency = "BRL",
  lastKnownUpdate,
  onClick,
}: CardListingItemProps) {
  const { t, numberFormatter } = useI18nHelpers({
    numberFormatOptions: {
      currency,
    },
  });
  const displayTitle = storeTitle || storeName;
  const isHighlighted = variant === "highlighted";
  const storeInitials = displayTitle.slice(0, 2).toUpperCase();
  const { trend, delta } = getPricesTrend(currentPrice, lastKnownPrice);

  const priceFormatter = useCallback(
    (price: number) => (price > 0 ? numberFormatter().format(price) : "-"),
    []
  );

  const value =
    delta && delta !== 0
      ? numberFormatter({ signDisplay: "always" }).format(delta)
      : null;

  const trendTitle = lastKnownUpdate
    ? t("listing.lastKnownUpdate", { date: lastKnownUpdate })
    : "";

  return (
    <div
      className={cn(
        "card-listings-grid text-sm leading-[14px] sm:leading-[20px]",
        isHighlighted
          ? "border-2 border-amber-400 bg-linear-to-r from-amber-100/60 via-amber-200/50 to-amber-100/60 hover:from-amber-100 hover:via-amber-100/70 hover:to-amber-100"
          : "hover:bg-black/5"
      )}
    >
      <div onClick={onClick}>
        <Link
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3"
        >
          <Avatar
            className={cn(
              "bg-black/20 border-2 size-12",
              isHighlighted ? "border-amber-400/70" : "border-black/5"
            )}
          >
            {storeImage && (
              <AvatarImage
                src={storeImage}
                alt={displayTitle}
                className="object-cover"
              />
            )}
            <AvatarFallback className="bg-black/10 font-medium text-white/90">
              {storeInitials}
            </AvatarFallback>
          </Avatar>
          <div className="font-medium truncate">{displayTitle}</div>
        </Link>
      </div>
      <div>{quantity}</div>
      <div className="flex sm:flex-row flex-col items-end sm:items-center gap-0.5 sm:gap-1.5">
        <div className="flex items-center gap-1.5">
          <TrendIcon trend={trend} />
          <span className={cn(trendColor[trend])}>
            {priceFormatter(currentPrice)}
          </span>
        </div>
        {lastKnownPrice && lastKnownPrice !== currentPrice && (
          <div
            className="text-black/60 text-xs line-through leading-[14px] sm:leading-[20px]"
            title={trendTitle}
            aria-label={t(`listing.price_trend.${trend}`)}
          >
            {priceFormatter(lastKnownPrice)}
          </div>
        )}
      </div>
      {cardUrl && (
        <div onClick={onClick}>
          <Link
            href={cardUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="sm:hidden inline-flex"
          >
            <Button variant="outline" size="icon-sm">
              <ExternalLinkIcon className="size-4" />
            </Button>
          </Link>
          <Link
            href={cardUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex"
          >
            <Button variant="outline" size="sm">
              <span>{t("listing.visit_store")}</span>
              <ExternalLinkIcon className="size-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

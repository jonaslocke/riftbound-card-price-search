"use client";

import { useI18nHelpers } from "@/app/i18n/HelpersProvider";
import { CardPriceStoreDto } from "@/app/types/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ExternalLinkIcon,
  MinusIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";

type CardListingItemProps = Omit<CardPriceStoreDto, "currency"> & {
  variant?: "default" | "highlighted";
  currency?: "BRL" | "USD";
  lastKnownUpdate?: string | null;
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
}: CardListingItemProps) {
  const { t, numberFormatter } = useI18nHelpers({
    numberFormatOptions: {
      currency,
    },
  });
  const displayTitle = storeTitle || storeName;
  const isHighlighted = variant === "highlighted";
  const formattedPrice =
    currentPrice > 0 ? numberFormatter().format(currentPrice) : "-";
  const storeInitials = displayTitle.slice(0, 2).toUpperCase();
  const priceTrend =
    lastKnownPrice === null
      ? "new"
      : currentPrice > lastKnownPrice
      ? "up"
      : currentPrice < lastKnownPrice
      ? "down"
      : "stable";
  const trendDelta =
    lastKnownPrice === null ? null : currentPrice - lastKnownPrice;
  const trendValue =
    trendDelta && trendDelta !== 0
      ? numberFormatter({ signDisplay: "always" }).format(trendDelta)
      : null;
  const trendTitle = lastKnownUpdate
    ? t("listing.lastKnownUpdate", { date: lastKnownUpdate })
    : undefined;
  const trendIcon = (() => {
    switch (priceTrend) {
      case "new":
        return <SparklesIcon className="size-4 text-emerald-600" />;
      case "up":
        return <ArrowUpIcon className="size-4 text-emerald-600" />;
      case "down":
        return <ArrowDownIcon className="size-4 text-rose-600" />;
      default:
        return <MinusIcon className="size-4 text-black/40" />;
    }
  })();

  return (
    <div
      className={cn(
        "card-listings-grid *:px-3 *:py-2 text-sm *:text-center",
        isHighlighted
          ? "border-2 border-amber-400 bg-linear-to-r from-amber-100/60 via-amber-200/50 to-amber-100/60 hover:from-amber-100 hover:via-amber-100/70 hover:to-amber-100"
          : "hover:bg-black/5"
      )}
    >
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
      <div>{quantity}</div>
      <div className="flex justify-center items-center gap-2">
        <span>{formattedPrice}</span>
        <span
          className="flex items-center gap-1 font-medium text-xs"
          title={trendTitle}
          aria-label={t(`listing.price_trend.${priceTrend}`)}
        >
          {trendIcon}
          {trendValue && <span>{trendValue}</span>}
        </span>
      </div>
      <Link href={cardUrl!} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" size="sm" className="cursor-pointer">
          <span className="hidden sm:block">{t("listing.visit_store")}</span>
          <ExternalLinkIcon className="size-4" />
        </Button>
      </Link>
    </div>
  );
}

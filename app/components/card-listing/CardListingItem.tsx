import { CardPriceStoreDto } from "@/app/types/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";
import { toLanguageTag, type LocaleSegment } from "@/app/i18n/settings";
import { cn } from "@/lib/utils";

type CardListingItemProps = CardPriceStoreDto & {
  locale: LocaleSegment;
  visitStoreLabel: string;
  unavailableLabel: string;
  variant?: "default" | "highlighted";
};

export default function CardListingItem({
  price,
  quantity,
  storeName,
  storeTitle,
  storeImage,
  storeUrl,
  cardUrl,
  currency,
  locale,
  visitStoreLabel,
  unavailableLabel,
  variant = "default",
}: CardListingItemProps) {
  const displayTitle = storeTitle || storeName;
  const isHighlighted = variant === "highlighted";
  const formattedPrice =
    price > 0
      ? new Intl.NumberFormat(toLanguageTag(locale), {
          style: "currency",
          currency: currency === "brl" ? "BRL" : "USD",
        }).format(price)
      : "-";

  return (
    <div
      className={cn(
        "grid items-center grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] border-b border-black/10 text-sm",
        isHighlighted
          ? "border-2 border-amber-400 bg-linear-to-r from-amber-100/60 via-amber-200/50 to-amber-100/60 hover:from-amber-100 hover:via-amber-100/70 hover:to-amber-100"
          : "hover:bg-black/5"
      )}
    >
      <div className="px-2 py-3">
        <div className="flex items-center gap-3">
          <a href={storeUrl} target="_blank" rel="noopener noreferrer">
            <Avatar
              className={cn(
                "border-2 bg-black/20 text-sm size-12",
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
              <AvatarFallback className="bg-black/5 text-black/60">
                {displayTitle.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </a>
          <div>
            <div className="font-medium text-black text-sm max-w-[26ch] truncate">
              {displayTitle}
            </div>
          </div>
        </div>
      </div>
      <div className="text-center px-2 py-1">
        <div className="flex items-center justify-center gap-2">
          <span className="text-black">{quantity}</span>
        </div>
      </div>
      <div className="text-center px-2 py-1">
        <div className="text-black">{formattedPrice}</div>
      </div>
      <div className="text-center px-2 py-1">
        {cardUrl ? (
          <Button
            variant="outline"
            size="sm"
            className="border-black/20 bg-white/60 hover:bg-white text-black shadow-sm"
            asChild
          >
            <a href={cardUrl} target="_blank" rel="noopener noreferrer">
              {visitStoreLabel}
              <ExternalLinkIcon className="ml-2 size-4" />
            </a>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="border-black/10 bg-white/30 text-black/40 shadow-sm"
            disabled
          >
            {unavailableLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

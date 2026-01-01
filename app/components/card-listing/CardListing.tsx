import { getServerTranslation } from "@/app/i18n/server";
import type { LocaleSegment } from "@/app/i18n/settings";
import type { CardPricesResponseDto } from "@/app/types/card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import CardListingItemWithAnalytics from "../analytics/CardListingItemWithAnalytics";

type CardListingProps = {
  prices: CardPricesResponseDto | null;
  locale: LocaleSegment;
  cardId: string;
  cardName: string;
};

const LISTING_HEADERS = [
  "listing.store_name",
  "listing.quantity",
  "listing.value",
  "listing.go_to",
];

export default async function CardListing({
  prices,
  locale,
  cardId,
  cardName,
}: CardListingProps) {
  const { t } = await getServerTranslation(locale);
  const listings = prices?.stores ?? [];
  const inStockStores = prices?.inStockStores ?? 0;

  if (listings.length < 1) {
    return (
      <div className="bg-white/75 mt-3 sm:mt-6 px-3 py-6 border border-slate-400 rounded-sm text-black">
        {t("listing.empty")}
      </div>
    );
  }

  return (
    <Card className="gap-0 bg-white/75 mt-3 sm:mt-6 py-3 border-slate-400 text-black">
      <CardHeader className="px-3 py-0! border-black/10 border-b">
        <CardTitle className="flex justify-between items-center gap-3 font-semibold text-lg">
          <h2>{t("listing.title")}</h2>
          <div className="text-end">
            {inStockStores > 0 && (
              <p className="text-black/60 text-xs">
                {t("listing.in_stock", { count: inStockStores })}
              </p>
            )}
            {prices?.lastUpdated && (
              <p className="text-black/40 text-xs">
                {t("listing.lastUpdated", { date: prices.lastUpdated })}
              </p>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="card-listings-grid bg-black/5 border-black/10 border-b">
          {LISTING_HEADERS.map((head, index) => (
            <div
              key={index}
              className={cn(
                "px-3 py-2 font-semibold text-black/70 text-sm",
                index !== 0 && "text-center"
              )}
            >
              {t(head)}
            </div>
          ))}
        </div>
        <div>
          {listings.map((listing, index) => (
            <CardListingItemWithAnalytics
              key={`${listing.storeName}-${index}`}
              {...listing}
              currency={listing.storeName === "tcgplayer" ? "USD" : "BRL"}
              variant={
                listing.storeName === "tcgplayer" ? "highlighted" : "default"
              }
              cardId={cardId}
              cardName={cardName}
              position={index}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

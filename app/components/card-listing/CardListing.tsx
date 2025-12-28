import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CardListingItem from "./CardListingItem";
import type { CardPricesResponseDto } from "@/app/types/card";
import type { LocaleSegment } from "@/app/i18n/settings";
import { getServerTranslation } from "@/app/i18n/server";

type CardListingProps = {
  prices: CardPricesResponseDto | null;
  locale: LocaleSegment;
};

export default async function CardListing({
  prices,
  locale,
}: CardListingProps) {
  const { t } = await getServerTranslation(locale);
  const listings = prices?.stores ?? [];
  const inStockStores = prices?.inStockStores ?? 0;
  const visitStoreLabel = t("listing.visit_store");
  const unavailableLabel = t("listing.unavailable");

  return (
    <Card className="border-slate-400 bg-white/75 text-black mt-3 sm:mt-6 py-3 gap-0">
      <CardHeader className="border-b border-black/10 py-0! px-3">
        <CardTitle className="text-lg font-semibold flex justify-between items-center">
          <h2>{t("listing.title")}</h2>
          {inStockStores > 0 && (
            <p className="text-xs text-black/50">
              {t("listing.in_stock", { count: inStockStores })}
            </p>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0 overflow-y-auto">
        <div className="grid">
          <div className="grid items-center grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] border-b border-black/10 bg-black/5">
            <div className="text-black/70 font-semibold px-3 py-2">
              {t("listing.store_name")}
            </div>
            <div className="text-black/70 font-semibold text-center px-3 py-2">
              {t("listing.quantity")}
            </div>
            <div className="text-black/70 font-semibold text-center px-3 py-2">
              {t("listing.value")}
            </div>
            <div className="text-black/70 font-semibold text-center px-3 py-2">
              {t("listing.go_to")}
            </div>
          </div>
          {listings.length ? (
            listings.map((listing, index) => (
              <CardListingItem
                key={`${listing.storeName}-${index}`}
                {...listing}
                locale={locale}
                visitStoreLabel={visitStoreLabel}
                unavailableLabel={unavailableLabel}
                variant={
                  listing.storeName === "tcgplayer" ? "highlighted" : "default"
                }
              />
            ))
          ) : (
            <div className="grid items-center grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] border-b border-black/10 text-sm">
              <div className="col-span-4 px-3 py-6 text-center text-black/60">
                {t("listing.empty")}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

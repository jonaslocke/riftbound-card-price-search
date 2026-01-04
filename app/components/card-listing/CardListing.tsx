import { getServerTranslation } from "@/app/i18n/server";
import type { LocaleSegment } from "@/app/i18n/settings";
import type { CardPricesResponseDto } from "@/app/types/card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import CardListingItemWithAnalytics from "../analytics/CardListingItemWithAnalytics";

const MOCK = [
  {
    storeName: "tcgplayer",
    storeUrl: "https://www.tcgplayer.com",
    storeTitle: "TCGplayer",
    storeImage: "/tcg-player-logo.svg",
    cardUrl: "https://www.tcgplayer.com/product/652940",
    quantity: 173,
    currentPrice: 4.54,
    lastKnownPrice: 5.6,
    currency: "usd",
  },
  {
    storeName: "epic-games",
    storeUrl: "https://www.epicgame.com.br",
    storeTitle: "Epic Game - A loja de card game mais ÉPICA do Brasil!",
    storeImage:
      "https://repositorio.sbrauble.com/arquivos/up/ecom/facebook/461.jpg",
    cardUrl: "https://www.epicgame.com.br/?view=ecom/item&tcg=19&card=155",
    quantity: 12,
    currentPrice: 79.9,
    lastKnownPrice: 74.9,
    currency: "brl",
  },
  {
    storeName: "miragem",
    storeUrl: "https://www.miragemhobby.com.br",
    storeTitle: "Miragem Hobby Store: Trading Card Games",
    storeImage:
      "https://repositorio.sbrauble.com/arquivos/up/ecom/facebook/62881.jpg",
    cardUrl: "https://www.miragemhobby.com.br/?view=ecom/item&tcg=19&card=155",
    quantity: 3,
    currentPrice: 79.75,
    lastKnownPrice: 79.75,
    currency: "brl",
  },
  {
    storeName: "infinity",
    storeUrl: "https://www.infinityshoptcg.com.br",
    storeTitle: "Infinity Shop",
    storeImage:
      "https://repositorio.sbrauble.com/arquivos/up/ecom/logo/630dc56559d7f-ya684-1e7jg-1836392754630dc56559dca.jpg",
    cardUrl:
      "https://www.infinityshoptcg.com.br/?view=ecom/item&tcg=19&card=155",
    quantity: 2,
    currentPrice: 99.94,
    lastKnownPrice: null,
    currency: "brl",
  },
  {
    storeName: "bolsa-do-infinito",
    storeUrl: "https://www.bolsadoinfinito.com.br",
    storeTitle: "Bolsa do Infinito",
    storeImage:
      "https://repositorio.sbrauble.com/arquivos/up/ecom/logo/62850bba1fcda-ut3v0-3xk1j-138784713462850bba1fd71.jpg",
    cardUrl:
      "https://www.bolsadoinfinito.com.br/?view=ecom/item&tcg=19&card=155",
    quantity: 2,
    currentPrice: 109.95,
    lastKnownPrice: 119.95,
    currency: "brl",
  },
];

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
              className={cn("font-semibold text-black/70 text-sm")}
            >
              {t(head)}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {/* {MOCK.map((listing, index) => ( */}
           {listings.map((listing, index) => (
            <CardListingItemWithAnalytics
              key={`${listing.storeName}-${index}`}
              {...listing}
              currency={listing.storeName === "tcgplayer" ? "USD" : "BRL"}
              variant={
                listing.storeName === "tcgplayer" ? "highlighted" : "default"
              }
              lastKnownUpdate={prices?.lastKnownUpdate ?? null}
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

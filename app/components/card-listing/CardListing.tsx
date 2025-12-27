import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
        <Table>
          <TableHeader>
            <TableRow className="border-black/10 bg-black/5">
              <TableHead className="text-black/70 font-semibold w-[40%] px-3 py-2">
                {t("listing.store_name")}
              </TableHead>
              <TableHead className="text-black/70 font-semibold text-center px-3 py-2">
                {t("listing.quantity")}
              </TableHead>
              <TableHead className="text-black/70 font-semibold text-center px-3 py-2">
                {t("listing.value")}
              </TableHead>
              <TableHead className="text-black/70 font-semibold text-center px-3 py-2">
                {t("listing.go_to")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.length ? (
              listings.map((listing, index) => (
                <CardListingItem
                  key={`${listing.storeName}-${index}`}
                  {...listing}
                  locale={locale}
                  visitStoreLabel={visitStoreLabel}
                  unavailableLabel={unavailableLabel}
                />
              ))
            ) : (
              <TableRow className="border-black/10 text-sm">
                <TableCell
                  colSpan={4}
                  className="px-3 py-6 text-center text-black/60"
                >
                  {t("listing.empty")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

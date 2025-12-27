import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExternalLinkIcon, PackageIcon } from "lucide-react";
import CardListingItem from "./CardListingItem";
import type { CardPricesResponseDto } from "@/app/types/card";

type CardListingProps = {
  prices: CardPricesResponseDto | null;
};

function getStockLabel(quantity: number) {
  if (quantity >= 10) return "high";
  if (quantity >= 3) return "medium";
  return "low";
}

export default function CardListing({ prices }: CardListingProps) {
  const listings = prices?.stores ?? [];
  const inStockStores = prices?.inStockStores ?? 0;

  return (
    <Card className="border-slate-400 bg-white/75 text-black mt-3 sm:mt-6 py-3 gap-0">
      <CardHeader className="border-b border-black/10 py-0! px-3">
        <CardTitle className="text-lg font-semibold flex justify-between items-center">
          <h2>Card Listings</h2>
          {inStockStores > 0 && (
            <p className="text-xs text-black/50">
              {inStockStores} stores currently selling this card
            </p>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-black/10 bg-black/5">
              <TableHead className="text-black/70 font-semibold w-[40%] px-3 py-2">
                Store Name
              </TableHead>
              <TableHead className="text-black/70 font-semibold text-center px-3 py-2">
                Quantity
              </TableHead>
              <TableHead className="text-black/70 font-semibold text-center px-3 py-2">
                Value
              </TableHead>
              <TableHead className="text-black/70 font-semibold text-center px-3 py-2">
                Go To
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.length ? (
              listings.map((listing, index) => (
                <CardListingItem
                  key={`${listing.storeName}-${index}`}
                  {...listing}
                />
              ))
            ) : (
              <TableRow className="border-black/10 text-sm">
                <TableCell
                  colSpan={4}
                  className="px-3 py-6 text-center text-black/60"
                >
                  No listings available yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { ExternalLinkIcon, PackageIcon } from "lucide-react";

type Listing = {
  id: number;
  storeName: string;
  storeTitle: string;
  storeImage: string | null;
  storeUrl: string;
  quantity: number;
  price: number;
  url: string | null;
  currency: "brl" | "usd";
  stock: "high" | "low" | "medium";
};

export default function CardListingItem({
  id,
  price,
  quantity,
  storeName,
  storeTitle,
  storeImage,
  storeUrl,
  url,
  stock,
  currency,
}: Listing) {
  const displayTitle = storeTitle || storeName;
  const formattedPrice =
    price > 0
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency === "brl" ? "BRL" : "USD",
        }).format(price)
      : "-";

  return (
    <TableRow className="border-black/10 hover:bg-black/5 text-sm">
      <TableCell className="px-2 py-3">
        <div className="flex items-center gap-3">
          <a href={storeUrl} target="_blank" rel="noopener noreferrer">
            <Avatar className="border-2 border-black/10 text-sm size-12">
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
            <div className="font-medium text-black text-base max-w-[26ch] truncate">
              {displayTitle}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-center px-2 py-1">
        <div className="flex items-center justify-center gap-2">
          <span className="text-black">{quantity}</span>
        </div>
      </TableCell>
      <TableCell className="text-center px-2 py-1">
        <div className="text-black">{formattedPrice}</div>
      </TableCell>
      <TableCell className="text-center px-2 py-1">
        {url ? (
          <Button
            variant="outline"
            size="sm"
            className="border-black/20 bg-white/60 hover:bg-white text-black shadow-sm"
            asChild
          >
            <a href={url} target="_blank" rel="noopener noreferrer">
              Visit Store
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
            Unavailable
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}

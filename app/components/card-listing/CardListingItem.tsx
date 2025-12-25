import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { ExternalLinkIcon, PackageIcon } from "lucide-react";

// {
//   id: index,
//   storeName: "Card Kingdom",
//   quantity: 24,
//   price: 12.99,
//   stock: "high",
//   url: "#",
// };

type Listing = {
  id: number;
  storeName: string;
  quantity: number;
  price: number;
  url: string;
  stock: "high" | "low" | "medium";
};

export default function CardListingItem({
  id,
  price,
  quantity,
  storeName,
  url,
  stock,
}: Listing) {
  return (
    <TableRow className="border-black/10 hover:bg-black/5 text-sm">
      <TableCell className="px-2 py-1">
        <div className="flex items-center gap-3">
          <Avatar className="size-8 border-2 border-black/10 bg-white text-sm">
            <AvatarFallback className="bg-black/5 text-black/60">
              {storeName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-black text-base">{storeName}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-center px-2 py-1">
        <div className="flex items-center justify-center gap-2">
          <span className="text-black">{quantity}</span>
        </div>
      </TableCell>
      <TableCell className="text-center px-2 py-1">
        <div className="text-black">${price.toFixed(2)}</div>
      </TableCell>
      <TableCell className="text-center px-2 py-1">
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
      </TableCell>
    </TableRow>
  );
}

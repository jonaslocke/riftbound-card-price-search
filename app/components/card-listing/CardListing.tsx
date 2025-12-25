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

export default function CardListing() {
  return (
    <Card className="border-slate-400 bg-white/75 text-black mt-6 py-3 gap-0">
      <CardHeader className="border-b border-black/10 py-0! px-3">
        <CardTitle className="text-lg font-semibold flex justify-between items-center">
          <h2>Card Listings</h2>
          <p className="text-xs text-black/50">
            {30} stores currently selling this card
          </p>
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
            {Array.from({ length: 30 }).map((_, index) => {
              const listing = {
                id: index,
                storeName: "Card Kingdom",
                quantity: 24,
                price: 12.99,
                stock: "high",
                url: "#",
              };
              return (
                <TableRow
                  key={index}
                  className="border-black/10 hover:bg-black/5 transition-colors"
                >
                  <TableCell className="px-3 py-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10 border-2 border-black/10 bg-white">
                        <AvatarFallback className="bg-black/5 text-black/60">
                          {listing.storeName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-black">
                          {listing.storeName}
                        </div>
                        <Badge
                          variant={
                            listing.stock === "high"
                              ? "default"
                              : listing.stock === "medium"
                              ? "secondary"
                              : "destructive"
                          }
                          className={
                            listing.stock === "high"
                              ? "mt-1 text-xs bg-black/10 text-black hover:bg-black/10"
                              : listing.stock === "medium"
                              ? "mt-1 text-xs bg-black/5 text-black/70 hover:bg-black/5"
                              : "mt-1 text-xs"
                          }
                        >
                          <PackageIcon className="mr-1 size-3" />
                          {listing.stock === "high"
                            ? "In Stock"
                            : listing.stock === "medium"
                            ? "Limited"
                            : "Low Stock"}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-center px-3 py-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg font-semibold text-black">
                        {listing.quantity}
                      </span>
                      <span className="text-sm text-black/60">available</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center px-3 py-2">
                    <div className="text-lg font-semibold text-black">
                      ${listing.price.toFixed(2)}
                    </div>
                    <div className="text-xs text-black/50 mt-0.5">per card</div>
                  </TableCell>

                  <TableCell className="text-center px-3 py-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-black/20 bg-white/60 hover:bg-white text-black shadow-sm"
                      asChild
                    >
                      <a
                        href={listing.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Store
                        <ExternalLinkIcon className="ml-2 size-4" />
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

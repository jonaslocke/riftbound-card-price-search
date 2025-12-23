import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

const mockListings = [
  {
    id: "1",
    storeName: "Card Kingdom",
    storeAvatar: "/placeholder-logo.svg",
    quantity: 24,
    price: 12.99,
    stock: "high",
    url: "#",
  },
  {
    id: "2",
    storeName: "TCGPlayer",
    storeAvatar: "/placeholder-logo.svg",
    quantity: 156,
    price: 11.49,
    stock: "high",
    url: "#",
  },
  {
    id: "3",
    storeName: "ChannelFireball",
    storeAvatar: "/placeholder-logo.svg",
    quantity: 8,
    price: 13.99,
    stock: "medium",
    url: "#",
  },
  {
    id: "4",
    storeName: "StarCityGames",
    storeAvatar: "/placeholder-logo.svg",
    quantity: 42,
    price: 12.49,
    stock: "high",
    url: "#",
  },
  {
    id: "5",
    storeName: "Card Market",
    storeAvatar: "/placeholder-logo.svg",
    quantity: 3,
    price: 14.99,
    stock: "low",
    url: "#",
  },
  {
    id: "6",
    storeName: "Miniature Market",
    storeAvatar: "/placeholder-logo.svg",
    quantity: 17,
    price: 11.99,
    stock: "medium",
    url: "#",
  },
];

export default function CardListing() {
  return (
    <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
      <CardHeader className="border-b border-slate-700">
        <CardTitle className="text-2xl font-bold text-slate-100">
          Card Listings
        </CardTitle>
        <p className="text-sm text-slate-400">
          {mockListings.length} stores currently selling this card
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700 hover:bg-slate-800/50">
              <TableHead className="text-slate-300 font-semibold w-[40%]">
                Store Name
              </TableHead>
              <TableHead className="text-slate-300 font-semibold text-center">
                Quantity
              </TableHead>
              <TableHead className="text-slate-300 font-semibold text-center">
                Value
              </TableHead>
              <TableHead className="text-slate-300 font-semibold text-center">
                Go To
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockListings.map((listing) => (
              <TableRow
                key={listing.id}
                className="border-slate-700 hover:bg-slate-800/70 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 border-2 border-slate-600">
                      <AvatarImage
                        src={listing.storeAvatar || "/placeholder.svg"}
                        alt={listing.storeName}
                      />
                      <AvatarFallback className="bg-slate-700 text-slate-300">
                        {listing.storeName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-slate-100">
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
                        className="mt-1 text-xs"
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

                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg font-semibold text-slate-100">
                      {listing.quantity}
                    </span>
                    <span className="text-sm text-slate-400">available</span>
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <div className="text-lg font-bold text-emerald-400">
                    ${listing.price.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">per card</div>
                </TableCell>

                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 bg-slate-700/50 hover:bg-slate-600 text-slate-100"
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

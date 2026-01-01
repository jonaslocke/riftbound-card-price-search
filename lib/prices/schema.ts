import { z } from "zod";

export const PriceStoreSchema = z.object({
  storeName: z.string().min(1),
  storeUrl: z.string().min(1),
  storeTitle: z.string().min(1),
  storeImage: z.string().min(1).nullable(),
  cardUrl: z.string().min(1).nullable(),
  quantity: z.number().int().nonnegative(),
  currentPrice: z.number().nonnegative(),
  lastKnownPrice: z.number().nonnegative().nullable(),
  currency: z.enum(["brl", "usd"]),
  error: z.string().min(1).optional(),
});

const SetIdSchema = z.enum(["OGN", "OGS", "SFD"]);

export const CardPricesResponseSchema = z.object({
  set: SetIdSchema,
  number: z.number().int().nonnegative(),
  inStockStores: z.number().int().nonnegative(),
  stores: z.array(PriceStoreSchema),
  lastUpdated: z.string().min(1),
});

export type PriceStore = z.infer<typeof PriceStoreSchema>;
export type CardPricesResponse = z.infer<typeof CardPricesResponseSchema>;

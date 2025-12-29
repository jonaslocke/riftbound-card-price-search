import { z } from "zod";

const DeviceTypeSchema = z.enum(["desktop", "mobile", "tablet"]);
const EnvSchema = z.enum([
  "prod",
  "staging",
  "dev",
  "production",
  "development",
  "test",
]);

const BaseEventSchema = z.object({
  event_id: z.string().uuid(),
  timestamp: z.string().min(1),
  flow_id: z.string().uuid(),
  session_id: z.string().uuid(),
  anonymous_id: z.string().uuid(),
  user_id: z.string().min(1).nullable().optional(),
  page_url: z.string().min(1),
  referrer: z.string().min(1).nullable().optional(),
  device_type: DeviceTypeSchema,
  env: EnvSchema,
  app_version: z.string().min(1).nullable().optional(),
});

const SuggestionSchema = z.object({
  card_id: z.string().min(1),
  card_name: z.string().min(1),
  position: z.number().int().nonnegative(),
});

const StoreSchema = z.object({
  store_id: z.string().min(1),
  store_name: z.string().min(1),
  price: z.number().nonnegative(),
  currency: z.string().min(1),
  quantity: z.number().int().nonnegative(),
  position: z.number().int().nonnegative(),
});

const SearchStartedSchema = BaseEventSchema.extend({
  event_name: z.literal("search_started"),
  payload: z.object({
    query: z.string().min(1),
    input_method: z.enum(["typing", "paste"]).optional(),
    source: z.enum(["search_bar"]).optional(),
  }),
});

const SuggestionsShownSchema = BaseEventSchema.extend({
  event_name: z.literal("suggestions_shown"),
  payload: z.object({
    query: z.string().min(1),
    suggestions: z.array(SuggestionSchema),
    latency_ms: z.number().int().nonnegative().optional(),
  }),
});

const CardSelectedSchema = BaseEventSchema.extend({
  event_name: z.literal("card_selected"),
  payload: z.object({
    query: z.string().min(1),
    card_id: z.string().min(1),
    card_name: z.string().min(1),
    selection_method: z.enum(["click", "keyboard"]),
    position: z.number().int().nonnegative(),
  }),
});

const CardDetailViewedSchema = BaseEventSchema.extend({
  event_name: z.literal("card_detail_viewed"),
  payload: z.object({
    card_id: z.string().min(1),
    card_name: z.string().min(1),
    auth_state: z.enum(["anonymous", "authenticated"]).optional(),
  }),
});

const PricesShownSchema = BaseEventSchema.extend({
  event_name: z.literal("prices_shown"),
  payload: z.object({
    card_id: z.string().min(1),
    stores: z.array(StoreSchema),
    price_count: z.number().int().nonnegative().optional(),
    latency_ms: z.number().int().nonnegative().optional(),
  }),
});

const StoreClickedSchema = BaseEventSchema.extend({
  event_name: z.literal("store_clicked"),
  payload: z.object({
    card_id: z.string().min(1),
    store_id: z.string().min(1),
    store_name: z.string().min(1),
    price: z.number().nonnegative(),
    currency: z.string().min(1),
    quantity: z.number().int().nonnegative(),
    position: z.number().int().nonnegative(),
  }),
});

const LoginStartedSchema = BaseEventSchema.extend({
  event_name: z.literal("login_started"),
  payload: z.object({}),
});

const LoginCompletedSchema = BaseEventSchema.extend({
  event_name: z.literal("login_completed"),
  payload: z.object({
    auth_method: z.string().min(1).optional(),
  }),
});

export const AnalyticsEventSchema = z.discriminatedUnion("event_name", [
  SearchStartedSchema,
  SuggestionsShownSchema,
  CardSelectedSchema,
  CardDetailViewedSchema,
  PricesShownSchema,
  StoreClickedSchema,
  LoginStartedSchema,
  LoginCompletedSchema,
]);

export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>;
export type AnalyticsEventName = AnalyticsEvent["event_name"];
export type AnalyticsStore = z.infer<typeof StoreSchema>;
export type AnalyticsSuggestion = z.infer<typeof SuggestionSchema>;

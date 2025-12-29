# Analytics API Contract

This document describes the analytics ingestion endpoint and request payload
used by the client helper.

## Endpoint

- Method: POST
- Path: /api/analytics
- Content-Type: application/json
- Success: 204 No Content

## Enablement

- Server guard: ANALYTICS_ENABLED
  - If "false" or "0", the endpoint returns 204 and discards the event.

## Request body

The payload must match the shared Zod schema in `lib/analytics/schema.ts`.

### Shared fields (all events)

- event_name: string (one of the event names below)
- event_id: uuid
- timestamp: iso8601 string
- flow_id: uuid
- session_id: uuid
- anonymous_id: uuid
- user_id: string | null (optional)
- page_url: string
- referrer: string | null (optional)
- device_type: "desktop" | "mobile" | "tablet"
- env: "prod" | "staging" | "dev" | "production" | "development" | "test"
- app_version: string | null (optional)
- payload: object (per-event)

### Events and payloads

- search_started
  - query: string
  - input_method?: "typing" | "paste"
  - source?: "search_bar"

- suggestions_shown
  - query: string
  - suggestions: [{ card_id, card_name, position }]
  - latency_ms?: number

- card_selected
  - query: string
  - card_id: string
  - card_name: string
  - selection_method: "click" | "keyboard"
  - position: number

- card_detail_viewed
  - card_id: string
  - card_name: string
  - auth_state?: "anonymous" | "authenticated"

- prices_shown
  - card_id: string
  - stores: [{ store_id, store_name, price, currency, quantity, position }]
  - price_count?: number
  - latency_ms?: number

- store_clicked
  - card_id: string
  - store_id: string
  - store_name: string
  - price: number
  - currency: string
  - quantity: number
  - position: number

- login_started
  - (empty object)

- login_completed
  - auth_method?: string

## Responses

- 204 No Content: event accepted
- 400 Bad Request: invalid JSON or schema validation error
- 500 Internal Server Error: database insert failed

## Storage

Collection: analytics_events

Fields:
- (all event fields)
- received_at: iso8601 string (server timestamp)

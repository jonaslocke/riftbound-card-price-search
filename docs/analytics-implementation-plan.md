# Analytics Implementation Plan (sendBeacon + MongoDB)

Goal: log each step of the analytics flow using Navigator.sendBeacon(), persist to MongoDB, and keep the pipeline simple for data collection now, metrics later.

## Scope

- Client emits events for each flow knot (search_started, suggestions_shown, card_selected, card_detail_viewed, prices_shown, store_clicked, login_started, login_completed).
- Server receives events in a single endpoint and stores raw events in MongoDB.
- No aggregation or metrics yet; raw append-only log.

## Data model

Collection: analytics_events

Minimal document shape:
- event_name: string
- event_id: uuid
- timestamp: iso8601
- flow_id: uuid
- session_id: uuid
- anonymous_id: uuid
- user_id: string | null
- page_url: string
- referrer: string | null
- device_type: string
- env: string
- payload: object (event-specific fields)

Indexes (initial):
- flow_id
- event_name
- timestamp
- user_id (sparse)

## Transport

Use Navigator.sendBeacon() on the client:
- POST to /api/analytics
- Content-Type: application/json
- Body: JSON stringified event payload
- sendBeacon used for reliable background delivery (including on navigation)

Fallback:
- If sendBeacon returns false, use fetch() with keepalive: true

## API endpoint (repo-specific)

Create `app/api/analytics/route.ts` alongside existing routes like
`app/api/health/db/route.ts`.

Responsibilities:
- Parse JSON body
- Validate required fields (minimal schema)
- Attach server-side timestamp (received_at)
- Insert into MongoDB using `lib/mongodb.ts` (same connection helpers)
- Return 204 on success

## Client instrumentation (repo-specific)

Create a small analytics helper in `lib/analytics.ts`:
- buildEvent(): merges core fields + payload
- trackEvent(): uses sendBeacon, with fetch fallback
- getOrCreateFlowId(): stored in sessionStorage
- getOrCreateAnonymousId(): stored in localStorage

Where to emit events in this repo:
- `app/components/SearchForm.tsx`: search_started, suggestions_shown, card_selected
  - search_started on debounce fetch start
  - suggestions_shown on fetchSuccess with the list payload
  - card_selected in handleSelect (include selection_method and position)
- `app/components/card-listing/CardListingItem.tsx`: store_clicked (price + quantity required)
- `app/[locale]/cards/[slug]/page.tsx`: card_detail_viewed and prices_shown
  - add a small client component (e.g. `app/components/analytics/CardDetailAnalytics.tsx`)
    that runs on mount and receives card + prices data as props
- `app/auth/signin/page.tsx`: login_started on handleSignIn
- `app/components/AppProviders.tsx` (or a new client child inside it): login_completed
  - use `useSession()` to detect a transition from unauthenticated to authenticated
  - keep flow_id stable across the login boundary

## Identity rules

- flow_id created on search_started and reused across the flow
- user_id optional, can be attached after login
- anonymous_id always present
- If login occurs mid-flow, keep the same flow_id

## Validation plan

- Unit test analytics helper (buildEvent + transport fallback)
- API route integration test (valid event returns 204, invalid returns 400)
- Manual smoke: trigger search flow and confirm documents in MongoDB

## Rollout

- Guard with env var: ANALYTICS_ENABLED=true
- Add basic rate limiting to /api/analytics if needed
- Monitor event volume and storage growth

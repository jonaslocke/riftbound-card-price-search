# Analytics Flow Plan

This document describes the user-experience analytics flow for search, card selection,
and store click-through, with a single flow id that survives anonymous and authenticated
states.

## Core identity fields

- flow_id: unique per search journey (start at search input, end after store click or timeout)
- session_id: browser session id (can span multiple flows)
- anonymous_id: stable device/browser id used before login
- user_id: optional; may be added mid-flow after login completes

## Event sequence

1) search_started
   - required: flow_id, session_id, anonymous_id, query
   - optional: user_id, input_method (typing|paste), source (search_bar)

2) suggestions_shown
   - required: flow_id, query, suggestions[]
   - suggestions[]: {card_id, card_name, position}
   - optional: latency_ms

3) card_selected
   - required: flow_id, query, card_id, card_name, selection_method (click|keyboard), position
   - optional: user_id

4) card_detail_viewed
   - required: flow_id, card_id, card_name
   - optional: user_id, auth_state (anonymous|authenticated)

5) prices_shown
   - required: flow_id, card_id, stores[]
   - stores[]: {store_id, store_name, price, currency, quantity, position}
   - optional: user_id, price_count, latency_ms

6) store_clicked
   - required: flow_id, card_id, store_id, store_name, price, currency, quantity, position
   - optional: user_id

## Auth transition events

- login_started
  - required: flow_id, anonymous_id

- login_completed
  - required: flow_id, user_id, anonymous_id
  - optional: auth_method

## Rules

- Create flow_id at search_started and reuse for all steps, including after login.
- user_id is optional; it may appear only after login_completed.
- Whenever a store appears in the flow, price and quantity are required.

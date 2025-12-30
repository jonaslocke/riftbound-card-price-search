# Cards Detail API

Endpoint: `GET /api/cards/detail`

Returns a single card (the exact match by `set` + selector) and an `other_printings` array with all other printings of the same card.

## Query parameters

- `set` (required): Set ID, case-insensitive (e.g., `OGN`, `SFD`).
- `number` (optional): Collector number or code. Used when `riftbound_id` is not provided.
  - Collector number example: `39`
  - Public code example: `SFD-224/221`
- `riftbound_id` (optional): Exact `riftbound_id` for a specific printing.

Required: `set` plus at least one of `number` or `riftbound_id`.

If `riftbound_id` is provided, it takes priority over `number`.

## Response

Success: `200 OK`, JSON object with:
- All base card fields
- `is_primary`: boolean
- `other_printings`: array of card objects with their own `is_primary`

Errors:
- `400` when `set` is missing or both selectors are missing
- `400` when `number` includes `/`
- `404` when the set or card is not found

## Selection rules

### 1) Set scoping
All matches are constrained to the provided `set` ID.

### 2) Lookup precedence
1. If `riftbound_id` is provided, match exact `riftbound_id` within the set.
2. Else if `number` is numeric, match all cards with the same `collector_number` in the set and select a preferred printing (see tie-breaker).
3. Else match a card where `public_code` or `riftbound_id` equals `number` (case-insensitive).

### 3) Collector-number tie-breaker (backward compatibility)
When multiple cards share the same `collector_number`, the selected card is the first by:
1. `metadata.signature` is `false`
2. `metadata.overnumbered` is `false`
3. `metadata.alternate_art` is `false`
4. Set release order (see below)
5. `collector_number` ascending
6. `public_code` / `riftbound_id` / `name` lexicographic

## Other printings

`other_printings` includes every other printing of the same card name, determined by:
- `metadata.clean_name` if present, otherwise `name`
- normalized (lowercase, non-alphanumeric collapsed to spaces)

Sorted by:
1. Set release order
2. `is_primary` true before false
3. `collector_number` ascending
4. `public_code` / `riftbound_id` / `name` lexicographic

## Set release order

Release precedence is defined in `lib/set-order.ts`:

- `OGS` → `OGN` → `SFD`

To add a new set, update this list only.

## Examples

Select by collector number:

`/api/cards/detail?set=OGN&number=39`

Select by `riftbound_id`:

`/api/cards/detail?set=SFD&riftbound_id=sfd-224-star-221`

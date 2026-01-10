# Card Search API Contract

This document describes the search endpoints exported from
`features/card-search/index.ts`.

## Endpoints

The handlers are exported as `searchRoute` and `advancedSearchRoute` and are
meant to be mounted by a Next.js route file. Paths below should match the route
file you mount them in.

### Search (simple)

- Handler: `searchRoute`
- Method: GET
- Path: (mounted by route)
- Content-Type: application/json

#### Query params

- q: string (required, trimmed)
- page: integer (optional, default 1, must be > 0)
- size: integer (optional, clamped to 10..100)

#### Response body

```json
{
  "items": ["Card"],
  "total": 42,
  "page": 1,
  "size": 24,
  "pages": 2
}
```

- items: array of `Card` from `app/types/card.schemas`
- pages: 0 when total is 0; otherwise `ceil(total / size)`

#### Errors

- 400 Bad Request: missing `q`

### Advanced Search

- Handler: `advancedSearchRoute`
- Method: GET
- Path: (mounted by route)
- Content-Type: application/json

#### Query params

All filters are optional unless noted. Multi-select values are comma-separated.

- domains: string[] (csv)
- sets: string[] (csv)
- types: string[] (csv)
- supertypes: string[] (csv)
- rarities: string[] (csv)
- keywords: string[] (csv)
- q: string (optional, 1..120 chars)
- alternateArt: boolean ("true/false", "1/0", "yes/no", "y/n")
- overNumbered: boolean ("true/false", "1/0", "yes/no", "y/n")
- signature: boolean ("true/false", "1/0", "yes/no", "y/n")
- page: integer (default 1, min 1)
- limit: integer (default 24, min 1, max 100)
- sort: "relevance" | "name" (default "relevance")
- order: "asc" | "desc" (default "asc")

#### Response body

```json
{
  "items": ["CardDetailsDto"],
  "page": 1,
  "limit": 24,
  "total": 120,
  "totalPages": 5,
  "facets": {
    "sets": [{ "_id": "SET1", "count": 12 }],
    "types": [{ "_id": "Unit", "count": 40 }],
    "supertypes": [{ "_id": "Legend", "count": 8 }],
    "rarities": [{ "_id": "Rare", "count": 9 }],
    "domains": [{ "_id": "Fire", "count": 14 }],
    "keywords": [{ "_id": "Charge", "count": 3 }],
    "alternateArt": [{ "_id": true, "count": 2 }],
    "overNumbered": [{ "_id": false, "count": 70 }],
    "signature": [{ "_id": null, "count": 1 }]
  }
}
```

- totalPages: at least 1 (even when total is 0)
- facets buckets use `{ _id: string | boolean | null, count: number }`

#### CardDetailsDto fields

- riftboundId: string
- name: string
- imageUrl: string
- imageThumbnailUrl: string
- type: CardTypeDisplay
- rarity: CardRarity
- domains: CardDomain[]
- setLabel: string
- normalizedCardNumber: string
- energy: integer | null
- power: integer | null
- might: integer | null
- description: string
- descriptionPlain: string
- artist: string
- artistLabel: string
- tags: string[]
- keywords: CardKeyword[]
- isAlteredArt: boolean
- isOverNumbered: boolean
- isSignature: boolean
- cardNumber: integer

Card enums are defined in `app/types/card.schemas`.

#### Errors

- 400 Bad Request: invalid query params, includes `issues` from Zod

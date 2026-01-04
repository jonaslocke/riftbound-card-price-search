# Prices API Flow

```
Client
  |
  v
GET /api/v2/cards/prices
  |
  v
Auth + rate limit + riftbound_id
  |
  v
Load card JSON -> { card, setId, collector }
  |
  v
getCachedPrices(riftboundId)
  |
  +--> cache fresh AND not TCGplayer-only?
  |        |
  |        +--> Yes: return cached payload
  |
  v
Build lastKnownPriceByStore (storeName/storeTitle keys)
  |
  v
fetchLivePrices(card, setId, collector, lastKnownPriceByStore)
  |
  v
response (stores + lastKnownPrice, lastUpdated, lastKnownUpdate: null)
  |
  v
shouldUpdateCache?
  |  (true if not TCGplayer-only OR no existing cache)
  |
  +--> Yes:
  |      lastKnownUpdate = response.lastUpdated
  |      upsert cache (response + lastKnownUpdate)
  |
  +--> No:
         lastKnownUpdate = cached lastKnownUpdate (if any)
         do not write cache
  |
  v
Return response + lastKnownUpdate
```

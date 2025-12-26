# Discoveries so far

## Confirmed
- Set numbering (provided by user): origins = 1, proving grounds = 2, spirit forge = 5.
- All stores in data/stores.json use the Ligamagic ecom platform (provided by user).
- In Ligamagic ecom item URLs, cardID maps to collector number, and card is the internal item id (iditem).
  Evidence: rift-crawler-one/Kadregrin the Infernal (#38) _ Mega Geek - Cardgame e Boardgame_files/ecom_main_mobile-v133-min.js.download
- Example Ligamagic ecom item page uses tcg=19 and includes edicao, cardID, and card.
  Evidence: rift-crawler-one/Kadregrin the Infernal (#38) _ Mega Geek - Cardgame e Boardgame.html
- Item page markup includes price and stock in the item table.
  Evidence: rift-crawler-one/Kadregrin the Infernal (#38) _ Mega Geek - Cardgame e Boardgame.html
- Spirit Forge (edicao=5) cardID does not match the collector numbers in data/sets/sfd.json for several known cards (Mega Geek examples below).
  Evidence (user-provided URLs):
  - Armed Assailant: cardID=2, card=561
  - Blood Rush: cardID=3, card=562
  - Detonate: cardID=5, card=564
  - Emperor of the Sands: cardID=197, card=483
  - Prodigal Explorer: cardID=199, card=484
  - Chem-Baroness: cardID=201, card=485
  - Battle Mistress: cardID=203, card=486
  - Grand Duelist: cardID=205, card=487
- Search results can include multiple TCGs with identical names; for Riftbound the correct item URL must include `tcg=19`.
  Evidence: rift-crawler-one/incinerate/Busca por_ Incinerate _ Mega Geek - Cardgame e Boardgame.html

## How to find ligamagic_id (card=)
1. Build mounted item URL: `/?view=ecom/item&tcg=19&edicao=<edicao>&cardID=<collector_number>&card=<collector_number>`.
2. Fetch HTML and verify it is a valid item page by checking for both:
   - `.card-preco` (price)
   - `.table-cards-body-cell` containing "Estoque"
3. If the mounted URL fails, search by name: `/?view=ecom%2Fitens&busca=<Card Name>`.
4. If the search redirects to an item page, extract `card=` from the final URL.
5. If the search returns a list, select the closest name match *and* ensure the candidate URL includes `tcg=19`, then extract `card=`.

## Pending validation
- Whether card (iditem) increments sequentially within a set across all stores.
- Whether list pages (view=ecom/itens) reliably expose iditem values for bulk mapping.

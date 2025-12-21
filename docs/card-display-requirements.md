Card Display Requirements

Source: layout extractions in `layout-extractions/` and card pool fields in `data/sets/*`.
Rule override (from request): all cards except Battlefield show Energy + Power; Unit shows Might as well; Battlefield shows none.

Common fields (all types)
- Card image: `media.image_url` (Battlefield is landscape; others are portrait).
- Card name: `name` (display as title).
- Type badge: `classification.type` with type icon.
- Rarity badge: `classification.rarity` with rarity icon.
- Domain badge(s): `classification.domain[]` with domain icon(s).
- Tags/traits badges: `tags[]` as secondary badges.
- Description: show `text.plain`.
- Card info: artist (`media.artist`), set label (`set.label`), card number (`public_code`).

Battlefield
- Layout: `layout-extractions/battlefield.html`.
- Required display:
  - Card image (landscape orientation, rotated asset in sample).
  - Name.
  - Type badge + rarity badge.
  - No domain badges.
  - Description.
  - Card info (artist/set/card number).
- Stats: do not display Energy, Power, or Might.

Unit
- Layout: `layout-extractions/unit.html`.
- Required display:
  - Card image (portrait).
  - Name.
  - Type badge + rarity badge.
  - Domain badges.
  - Tags/traits badges (faction/tribe).
  - Description.
  - Card info.
- Stats: display Energy, Power, and Might.

Unit (Champion)
- Layout: `layout-extractions/unit-champion.html`.
- Required display: same as Unit.
- Type label should include supertype if present (e.g., "Champion Unit").
- Stats: display Energy, Power, and Might.

Spell
- Layouts: `layout-extractions/spell.html`, `layout-extractions/spell-action.html`, `layout-extractions/spell-reaction.html`.
- Required display:
  - Card image (portrait).
  - Name.
  - Type badge + rarity badge.
  - Domain badges.
  - Description (Action/Reaction keywords come from `text.plain`).
  - Card info.
- Stats: display Energy and Power (no Might).

Legend
- Layout: `layout-extractions/legend.html`.
- Required display:
  - Card image (portrait).
  - Name.
  - Type badge + rarity badge.
  - Domain badges (multi-domain possible).
  - Tags/traits badges (e.g., champion name).
  - Description.
  - Card info.
- Stats: display Energy and Power (no Might).

Rune
- Layout: `layout-extractions/rune.html`.
- Required display:
  - Card image (portrait).
  - Name.
  - Type badge + rarity badge.
  - Domain badge(s).
  - No description.
  - Card info.
- Type label should include supertype if present (e.g., "Basic Rune").
- Stats: do not display Energy, Power, or Might.

Gear
- Layouts: `layout-extractions/gear.html`, `layout-extractions/gear-equipment.html`.
- Required display:
  - Card image (portrait).
  - Name.
  - Type badge + rarity badge.
  - Domain badges.
  - Tags/traits badges if present (includes Equipment when applicable).
  - Description.
  - Card info.
- Stats: display Energy and Power (no Might).

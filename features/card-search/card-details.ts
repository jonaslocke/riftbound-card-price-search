import { Card } from "@/app/types/card.schemas";
import type { CardDetailsDto } from "./types";
import { buildTypeDisplay } from "./helper/buildTypeDisplay";
import { normalizeFields } from "./helper/normalizeFields";

export function toCardDetailsDto(card: Card): CardDetailsDto {
  const dto: CardDetailsDto = {
    riftboundId: card.riftbound_id,
    name: card.name,
    imageUrl: `/api/images/cards/${card.riftbound_id}.png`,
    imageThumbnailUrl: `/api/images/cards/${card.riftbound_id}.webp`,
    type: buildTypeDisplay(
      card.classification.type,
      card.classification.supertype
    ),
    rarity: normalizeFields<CardDetailsDto["rarity"]>(
      card.classification.rarity
    ),
    domains: normalizeFields<CardDetailsDto["domains"]>(
      card.classification.domain
    ),
    setLabel: card.set.label,
    normalizedCardNumber: `${card.set.set_id}-${card.collector_number}`,
    energy: card.attributes.energy,
    power: card.attributes.power,
    might: card.attributes.might,
    descriptionPlain: card.text.plain.trim(),
    description: card.text.plain.trim(),
    artistLabel: card.media.artist,
    artist: card.media.artist,
    tags: card.tags,
    keywords: card.keywords,
    isAlteredArt: card.metadata.alternate_art,
    isOverNumbered: card.metadata.overnumbered,
    isSignature: card.metadata.signature,
    cardNumber: card.collector_number,
  };

  return dto;
}

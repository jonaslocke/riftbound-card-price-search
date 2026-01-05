import {
  Card,
  CardDomainSchema,
  CardKeywordSchema,
  CardRaritySchema,
  CardSupertypeSchema,
  CardTypeDisplay,
  CardTypeDisplaySchema,
  CardTypeSchema,
} from "@/app/types/card.schemas";
import { z } from "zod";

export const CardDetailsDtoSchema = z.object({
  riftboundId: z.string().min(1),
  name: z.string().min(1),
  imageUrl: z.string().min(1),
  imageThumbnailUrl: z.string().min(1),
  type: CardTypeDisplaySchema,
  rarity: CardRaritySchema,
  domains: z.array(CardDomainSchema),
  setLabel: z.string().min(1),
  normalizedCardNumber: z.string().min(1),
  energy: z.number().int().nullable(),
  power: z.number().int().nullable(),
  might: z.number().int().nullable(),
  description: z.string(),
  descriptionPlain: z.string(),
  artist: z.string().min(1),
  artistLabel: z.string().min(1),
  tags: z.array(z.string()),
  keywords: z.array(CardKeywordSchema),
  isAlteredArt: z.boolean(),
  isOverNumbered: z.boolean(),
  isSignature: z.boolean(),
});

export type CardDetailsDto = z.infer<typeof CardDetailsDtoSchema>;

function buildTypeDisplay(
  type: z.infer<typeof CardTypeSchema>,
  supertype: z.infer<typeof CardSupertypeSchema> | null
): CardTypeDisplay {
  return (supertype ? `${supertype} ${type}` : type) as CardTypeDisplay;
}

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
    rarity: card.classification.rarity,
    domains: card.classification.domain,
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
  };

  return dto;
}

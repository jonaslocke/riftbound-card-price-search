import type {
  Card,
  CardDetailsDto,
  CardDomain,
  CardSupertype,
  CardType,
} from "../app/types/card";

export function toCardDetailsDto(card: Card): CardDetailsDto {
  const typeRaw = card.classification?.type ?? "unit";
  const supertypeRaw = card.classification?.supertype ?? null;
  const rarityRaw = card.classification?.rarity ?? "common";
  const typeKey = typeRaw.toLowerCase() as CardType;
  const supertypeKey = supertypeRaw
    ? (supertypeRaw.toLowerCase() as CardSupertype)
    : null;
  const type: CardDetailsDto["type"] = supertypeKey
    ? (`${supertypeKey} ${typeKey}` as CardDetailsDto["type"])
    : typeKey;
  const rarity = rarityRaw.toLowerCase() as CardDetailsDto["rarity"];
  const showStats = typeKey !== "battlefield" && typeKey !== "rune";
  const showMight = typeKey === "unit";
  const energy = showStats ? card.attributes?.energy ?? null : null;
  const power = showStats ? card.attributes?.power ?? null : null;
  const might = showMight ? card.attributes?.might ?? null : null;
  const domains = normalizeDomains(
    type === "battlefield" ? [] : card.classification?.domain ?? []
  );

  return {
    riftboundId: card.riftbound_id?.toLowerCase(),
    name: card.name,
    imageUrl: `/api/images/cards/${card.riftbound_id}.png`,
    imageThumbnailUrl: `/api/images/cards/${card.riftbound_id}.webp`,
    type,
    rarity,
    domains,
    setLabel: card.set?.label ?? card.set?.set_id ?? "Unknown",
    normalizedCardNumber: `${card.set?.set_id}-${card.collector_number}`,
    energy,
    power,
    might,
    descriptionPlain: card.text?.plain?.trim() ?? "",
    artistLabel: card.media?.artist ?? "Unknown",
    tags: card.tags ?? [],
    cardNumber: card.public_code ?? "Unknown",
    isAlteredArt: card.metadata?.alternate_art ?? false,
    isOverNumbered: card.metadata?.overnumbered ?? false,
    isSignature: card.metadata?.signature ?? false,
  };
}

function normalizeDomains(domains: CardDomain[] | string[]) {
  const allowed: CardDomain[] = [
    "body",
    "calm",
    "chaos",
    "fury",
    "mind",
    "order",
  ];
  const allowedSet = new Set(allowed);

  return domains
    .map((domain) => domain.toLowerCase())
    .filter((domain): domain is CardDomain =>
      allowedSet.has(domain as CardDomain)
    );
}

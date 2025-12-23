import type { Card, CardDetailsDto, CardDomain } from "../app/types/card";

export function toCardDetailsDto(card: Card): CardDetailsDto {
  const type = card.classification?.type ?? "unit";
  const rarity = card.classification?.rarity ?? "common";
  const showStats = type !== "battlefield" && type !== "rune";
  const showMight = type === "unit";
  const energy = showStats ? card.attributes?.energy ?? null : null;
  const power = showStats ? card.attributes?.power ?? null : null;
  const might = showMight ? card.attributes?.might ?? null : null;
  const domains = normalizeDomains(
    type === "battlefield" ? [] : card.classification?.domain ?? []
  );

  return {
    name: card.name,
    imageUrl: card.media?.image_url,
    domains,
    tags: card.tags ?? [],
    energy,
    power,
    might,
    type,
    rarity,
    descriptionPlain: card.text?.plain?.trim() ?? "",
    artistLabel: card.media?.artist ?? "Unknown",
    setLabel: card.set?.label ?? card.set?.set_id ?? "Unknown",
    cardNumber: card.public_code ?? "Unknown",
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
    .filter((domain): domain is CardDomain => allowedSet.has(domain as CardDomain));
}

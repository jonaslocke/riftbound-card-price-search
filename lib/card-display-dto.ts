import type { Card, CardDomain } from "../app/types/card";
import domainColors from "../data/domain-colors.json";

export type CardDisplayBadge = {
  iconSrc?: string;
  label: string;
};

export type CardDisplayStat = {
  label: string;
  value: number | null | undefined;
};

export type CardDisplayDomainColor = {
  domain: CardDomain;
  color: string;
};

export type CardDisplayData = {
  name: string;
  imageUrl?: string;
  isLandscape: boolean;
  badges: CardDisplayBadge[];
  colors: CardDisplayDomainColor[];
  domains: CardDomain[];
  tags: string[];
  stats: CardDisplayStat[];
  energy: number | null;
  power: number | null;
  might: number | null;
  type: string;
  rulesText: string;
  artistLabel: string;
  setLabel: string;
  cardNumber: string;
  placeholderInitial: string;
};

const TYPE_ICON_SIZE = 24;
const DOMAIN_ICON_SIZE = 32;
const RARITY_ICON_SIZE = 128;

export function toCardDisplayData(card: Card): CardDisplayData {
  const typeKey = card.classification?.type?.toLowerCase();
  const typeLabel =
    [card.classification?.supertype, card.classification?.type]
      .filter(Boolean)
      .join(" ") || "Unknown";
  const rarityLabel = card.classification?.rarity ?? "Unknown";
  const setLabel = card.set?.label ?? card.set?.set_id ?? "Unknown";
  const cardNumber = card.public_code ?? "Unknown";
  const isLandscape = card.orientation === "landscape";
  const imageUrl = card.media?.image_url;

  const showStats = typeKey !== "battlefield" && typeKey !== "rune";
  const showMight = typeKey === "unit";
  const energy = showStats ? card.attributes?.energy ?? null : null;
  const power = showStats ? card.attributes?.power ?? null : null;
  const might = showMight ? card.attributes?.might ?? null : null;
  const stats: CardDisplayStat[] = showStats
    ? [
        { label: "Energy", value: energy },
        { label: "Power", value: power },
        ...(showMight ? [{ label: "Might", value: might }] : []),
      ]
    : [];

  const domainList = normalizeDomains(
    typeKey === "battlefield" ? [] : card.classification?.domain ?? []
  );
  const tags = card.tags ?? [];
  const rulesText = typeKey === "rune" ? "" : card.text?.plain?.trim() ?? "";
  const colors = domainList.reduce<CardDisplayDomainColor[]>((acc, domain) => {
    const color =
      (domainColors as Record<string, string>)[domain.toLowerCase()];
    if (color) {
      acc.push({ domain, color });
    }
    return acc;
  }, []);

  const badges: CardDisplayBadge[] = [
    {
      iconSrc: typeKey
        ? `/assets/types/${typeKey}-${TYPE_ICON_SIZE}.webp`
        : undefined,
      label: typeLabel,
    },
    {
      iconSrc: card.classification?.rarity
        ? `/assets/rarities/${card.classification.rarity.toLowerCase()}-${RARITY_ICON_SIZE}.webp`
        : undefined,
      label: rarityLabel,
    },
    ...domainList.map((domain) => ({
      iconSrc: `/assets/domains/${domain.toLowerCase()}-${DOMAIN_ICON_SIZE}.webp`,
      label: domain,
    })),
  ];

  return {
    name: card.name,
    imageUrl,
    isLandscape,
    badges,
    colors,
    domains: domainList,
    tags,
    stats,
    energy,
    power,
    might,
    type: typeLabel,
    rulesText,
    artistLabel: card.media?.artist ?? "Unknown",
    setLabel,
    cardNumber,
    placeholderInitial: card.name.slice(0, 1),
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

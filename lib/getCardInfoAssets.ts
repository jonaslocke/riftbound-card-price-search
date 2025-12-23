import type { CardDomain } from "@/app/types/card";

import body16 from "@/assets/domains/body-16.webp";
import body32 from "@/assets/domains/body-32.webp";
import body64 from "@/assets/domains/body-64.webp";
import calm16 from "@/assets/domains/calm-16.webp";
import calm32 from "@/assets/domains/calm-32.webp";
import calm64 from "@/assets/domains/calm-64.webp";
import chaos16 from "@/assets/domains/chaos-16.webp";
import chaos32 from "@/assets/domains/chaos-32.webp";
import chaos64 from "@/assets/domains/chaos-64.webp";
import fury16 from "@/assets/domains/fury-16.webp";
import fury32 from "@/assets/domains/fury-32.webp";
import fury64 from "@/assets/domains/fury-64.webp";
import mind16 from "@/assets/domains/mind-16.webp";
import mind32 from "@/assets/domains/mind-32.webp";
import mind64 from "@/assets/domains/mind-64.webp";
import order16 from "@/assets/domains/order-16.webp";
import order32 from "@/assets/domains/order-32.webp";
import order64 from "@/assets/domains/order-64.webp";
import rainbow16 from "@/assets/domains/rainbow-16.webp";
import rainbow32 from "@/assets/domains/rainbow-32.webp";
import rainbow64 from "@/assets/domains/rainbow-64.webp";

import battlefield16 from "@/assets/types/battlefield-16.webp";
import battlefield24 from "@/assets/types/battlefield-24.webp";
import battlefield48 from "@/assets/types/battlefield-48.webp";
import gear16 from "@/assets/types/gear-16.webp";
import gear24 from "@/assets/types/gear-24.webp";
import gear48 from "@/assets/types/gear-48.webp";
import legend16 from "@/assets/types/legend-16.webp";
import legend24 from "@/assets/types/legend-24.webp";
import legend48 from "@/assets/types/legend-48.webp";
import rune16 from "@/assets/types/rune-16.webp";
import rune24 from "@/assets/types/rune-24.webp";
import rune48 from "@/assets/types/rune-48.webp";
import spell16 from "@/assets/types/spell-16.webp";
import spell24 from "@/assets/types/spell-24.webp";
import spell48 from "@/assets/types/spell-48.webp";
import unit16 from "@/assets/types/unit-16.webp";
import unit24 from "@/assets/types/unit-24.webp";
import unit48 from "@/assets/types/unit-48.webp";

import common16 from "@/assets/rarities/common-16.webp";
import common24 from "@/assets/rarities/common-24.webp";
import common48 from "@/assets/rarities/common-48.webp";
import epic16 from "@/assets/rarities/epic-16.webp";
import epic24 from "@/assets/rarities/epic-24.webp";
import epic48 from "@/assets/rarities/epic-48.webp";
import rare16 from "@/assets/rarities/rare-16.webp";
import rare24 from "@/assets/rarities/rare-24.webp";
import rare48 from "@/assets/rarities/rare-48.webp";
import showcase16 from "@/assets/rarities/showcase-16.webp";
import showcase24 from "@/assets/rarities/showcase-24.webp";
import showcase48 from "@/assets/rarities/showcase-48.webp";
import uncommon16 from "@/assets/rarities/uncommon-16.webp";
import uncommon24 from "@/assets/rarities/uncommon-24.webp";
import uncommon48 from "@/assets/rarities/uncommon-48.webp";


type Size = "sm" | "md" | "lg";

type Props = {
  domains: CardDomain[];
  type: string;
  rarity: string;
  size: Size;
};

export const getCardInfoAssets = (card: Props) => {
  const domainKey = card.domains[0] as string | undefined;
  const typeKey = card.type.split(" ").slice(-1)[0]?.toLowerCase();
  const rarityKey = card.rarity?.toLowerCase();

  const domainAssets: Record<string, Record<Size, typeof body16>> = {
    body: { sm: body16, md: body32, lg: body64 },
    calm: { sm: calm16, md: calm32, lg: calm64 },
    chaos: { sm: chaos16, md: chaos32, lg: chaos64 },
    fury: { sm: fury16, md: fury32, lg: fury64 },
    mind: { sm: mind16, md: mind32, lg: mind64 },
    order: { sm: order16, md: order32, lg: order64 },
    rainbow: { sm: rainbow16, md: rainbow32, lg: rainbow64 },
  };

  const typeAssets = {
    battlefield: { sm: battlefield16, md: battlefield24, lg: battlefield48 },
    gear: { sm: gear16, md: gear24, lg: gear48 },
    legend: { sm: legend16, md: legend24, lg: legend48 },
    rune: { sm: rune16, md: rune24, lg: rune48 },
    spell: { sm: spell16, md: spell24, lg: spell48 },
    unit: { sm: unit16, md: unit24, lg: unit48 },
  };

  const rarityAssets = {
    common: { sm: common16, md: common24, lg: common48 },
    epic: { sm: epic16, md: epic24, lg: epic48 },
    rare: { sm: rare16, md: rare24, lg: rare48 },
    showcase: { sm: showcase16, md: showcase24, lg: showcase48 },
    uncommon: { sm: uncommon16, md: uncommon24, lg: uncommon48 },
  };

  const domain = domainKey ? domainAssets[domainKey]?.[card.size] : undefined;
  const type =
    typeKey && typeKey in typeAssets
      ? typeAssets[typeKey as keyof typeof typeAssets][card.size]
      : undefined;
  const rarity =
    rarityKey && rarityKey in rarityAssets
      ? rarityAssets[rarityKey as keyof typeof rarityAssets][card.size]
      : undefined;

  return {
    rarityImg: rarity?.src,
    typeImg: type?.src,
    domainImg: domain?.src,
  };
};

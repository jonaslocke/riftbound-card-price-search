"use client";

import { Badge } from "@/components/ui/badge";
import { getCardInfoAssets } from "@/lib/getCardInfoAssets";
import CardDomain from "./CardDomain";
import { useCardDetails } from "./context";

export default function CardMainInfo() {
  const card = useCardDetails();
  const { type, rarity, domains } = card;
  const { rarityImg, typeImg } = getCardInfoAssets({ ...card, size: "sm" });

  return (
    <div className="flex gap-0.5">
      <Badge variant="secondary">
        <img src={rarityImg} alt={`${rarity} image`} />
        <span>{rarity}</span>
      </Badge>
      <Badge variant="secondary">
        <img src={typeImg} alt={`${type} image`} className="invert" />
        <span>{type}</span>
      </Badge>
      {domains.length > 0 &&
        domains.map((domain) => <CardDomain key={domain} domain={domain} />)}
    </div>
  );
}

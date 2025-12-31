"use client";

import { Badge } from "@/components/ui/badge";
import { getCardInfoAssets } from "@/lib/getCardInfoAssets";
import Image from "next/image";
import { useCardDetails } from "../../state/context";
import CardDomain from "./CardDomain";

export default function CardSuperTypes() {
  const card = useCardDetails();
  const { type, rarity, domains } = card;
  const { rarityImg, typeImg } = getCardInfoAssets({ ...card, size: "sm" });

  return (
    <div className="flex flex-wrap gap-0.5 gap-y-1">
      <Badge variant="secondary">
        {rarityImg && (
          <Image
            src={rarityImg}
            alt={`${rarity} image`}
            width={16}
            height={16}
          />
        )}
        <span className="capitalize">{rarity}</span>
      </Badge>
      <Badge variant="secondary">
        {typeImg && (
          <Image
            src={typeImg}
            alt={`${type} image`}
            className="invert"
            width={16}
            height={16}
          />
        )}
        <span className="capitalize">{type}</span>
      </Badge>
      {domains.length > 0 &&
        domains.map((domain) => <CardDomain key={domain} domain={domain} />)}
    </div>
  );
}

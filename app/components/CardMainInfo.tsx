import { Badge } from "@/components/ui/badge";
import { CardDisplayData } from "@/lib/card-display-dto";
import CardDomainEl from "./CardDomain";
import { getCardInfoAssets } from "@/lib/getCardInfoAssets";

export default function CardMainInfo(card: CardDisplayData) {
  const { type, rarity, domains } = card;
  const { domainImg, rarityImg, typeImg } = getCardInfoAssets({
    ...card,
    size: "sm",
  });
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
        domains.map((domain, index) => (
          <CardDomainEl key={index} domain={domain} />
        ))}
    </div>
  );
}

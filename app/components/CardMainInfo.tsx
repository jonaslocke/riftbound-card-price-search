import { Badge } from "@/components/ui/badge";
import { CardDisplayData } from "@/lib/card-display-dto";
import CardDomainEl from "./CardDomain";

export default function CardMainInfo({
  type,
  rarity,
  domains,
}: CardDisplayData) {
  return (
    <div className="flex gap-0.5">
      <Badge variant="secondary">{rarity}</Badge>
      <Badge variant="secondary">{type}</Badge>
      {domains.length > 0 &&
        domains.map((domain, index) => (
          <CardDomainEl key={index} domain={domain} />
        ))}
    </div>
  );
}

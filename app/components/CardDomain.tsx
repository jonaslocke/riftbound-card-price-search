import { Badge } from "@/components/ui/badge";
import type { CardDisplayData } from "@/lib/card-display-dto";
import { getCardInfoAssets } from "@/lib/getCardInfoAssets";
import type { CardDomain } from "../types/card";

type Size = "sm" | "md" | "lg";

export default function CardDomain({
  card,
  domain,
  size = "sm",
}: {
  card: CardDisplayData;
  domain: CardDomain;
  size?: Size;
}) {
  const { domainImg } = getCardInfoAssets({
    ...card,
    domains: [domain],
    size,
  });

  return (
    <Badge variant="secondary" className="select-none">
      {domainImg ? <img src={domainImg} alt="" /> : null}
      <span className="capitalize">{domain}</span>
    </Badge>
  );
}

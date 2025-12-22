import { Badge } from "@/components/ui/badge";
import { getDomainImage } from "@/lib/getDomainImage";
import type { CardDomain } from "../types/card";

export default function CardDomain({ domain }: { domain: CardDomain }) {
  const domainImgSrc = getDomainImage({
    domain,
  });

  return (
    <Badge variant="secondary" className="select-none">
      <img src={domainImgSrc} alt="" />
      <span className="capitalize">{domain}</span>
    </Badge>
  );
}

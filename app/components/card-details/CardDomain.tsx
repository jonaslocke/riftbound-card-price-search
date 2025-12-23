"use client";

import { Badge } from "@/components/ui/badge";
import type { CardDomain as Domain } from "@/app/types/card";
import { getCardInfoAssets } from "@/lib/getCardInfoAssets";
import { useCardDetails } from "./context";

type Size = "sm" | "md" | "lg";

export default function CardDomain({
  domain,
  size = "sm",
}: {
  domain: Domain;
  size?: Size;
}) {
  const card = useCardDetails();
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

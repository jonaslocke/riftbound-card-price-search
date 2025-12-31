"use client";

import type { CardDomain as Domain } from "@/app/types/card";
import { Badge } from "@/components/ui/badge";
import { getCardInfoAssets } from "@/lib/getCardInfoAssets";
import Image from "next/image";
import { useI18nHelpers } from "@/app/i18n/HelpersProvider";
import { useCardDetails } from "../../state/context";
import { Size } from "../../types";

type Props = {
  domain: Domain;
  size?: Size;
};

export default function CardDomain({ domain, size = "sm" }: Props) {
  const { t } = useI18nHelpers();
  const card = useCardDetails();
  const { domainImg } = getCardInfoAssets({
    ...card,
    domains: [domain],
    size,
  });

  return (
    <Badge variant="secondary" className="select-none">
      {domainImg && (
        <Image
          src={domainImg}
          alt={t("card.domain_image_alt", { domain })}
          width={16}
          height={16}
        />
      )}
      <span className="capitalize">{domain}</span>
    </Badge>
  );
}

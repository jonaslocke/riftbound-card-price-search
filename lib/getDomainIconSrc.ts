import { CardDomain } from "@/app/types/card";
import type { CardDisplayData } from "@/lib/card-display-dto";

type Size = "sm" | "md" | "lg";

export function getDomainIconSrc(
  domains: CardDisplayData["domains"],
  size: Size
) {
  const domain = domains[0];
  if (!domain) {
    return undefined;
  }

  const sizeMap: Record<Size, number> = {
    sm: 16,
    md: 32,
    lg: 64,
  };

  return `/assets/domains/${domain}-${sizeMap[size]}.webp`;
}

export const getDomainImage = ({
  size = "sm",
  domain,
}: {
  size?: Size;
  domain: CardDomain;
}) => {
  const sizeMap: Record<Size, number> = {
    sm: 16,
    md: 32,
    lg: 64,
  };

  return `/assets/domains/${domain}-${sizeMap[size]}.webp`;
};

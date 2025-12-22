import { CardDomain } from "@/app/types/card";

type Size = "sm" | "md" | "lg";

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

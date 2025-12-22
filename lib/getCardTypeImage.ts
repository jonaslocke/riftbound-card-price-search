import cardTypes from "@/data/card-types.json";

type Size = "sm" | "md" | "lg";
export type CardType = (typeof cardTypes)[number];

export const getCardTypeImage = ({
  size = "sm",
  type,
}: {
  size?: Size;
  type: CardType;
}) => {
  const sizeMap: Record<Size, number> = {
    sm: 16,
    md: 32,
    lg: 64,
  };

  return `/assets/types/${type.toLowerCase()}-${sizeMap[size]}.webp`;
};

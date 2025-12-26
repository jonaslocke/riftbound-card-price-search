"use client";

import { getCardInfoAssets } from "@/lib/getCardInfoAssets";
import { useCardDetails } from "./context";
import type { CardDomain } from "@/app/types/card";
import { FC } from "react";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

export default function CardCost({ size = "sm" }: { size?: Size }) {
  const card = useCardDetails();
  const { domainImg } = getCardInfoAssets({ ...card, size });

  return <CardCostUi {...card} domainImg={domainImg} />;
}

type CardCostUi = {
  energy: number | null;
  power: number | null;
  domainImg?: string;
  domains: CardDomain[];
  variant?: "default" | "light";
};

export const CardCostUi: FC<CardCostUi> = ({
  energy,
  power,
  domainImg,
  domains,
  variant = "default",
}) => {
  return (
    <div className="flex items-center h-6 gap-1">
      <div
        className={cn(
          "flex justify-center items-center size-5 rounded-full text-xs",
          variant === "default" ? "bg-black/10" : "bg-white/10"
        )}
      >
        {energy}
      </div>
      {power && domainImg && (
        <div className="flex ml-1">
          {Array.from({ length: power }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "flex justify-center items-center rounded-full border border-white/10 -ml-1.5",
                variant === "default" ? "bg-black/10" : "bg-white/10"
              )}
            >
              <img src={domainImg} alt={`${domains[0]} power image`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

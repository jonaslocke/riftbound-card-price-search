"use client";

import { getCardInfoAssets } from "@/lib/getCardInfoAssets";
import { cn } from "@/lib/utils";
import { FC } from "react";
import { useCardDetails } from "../../state/context";
import { type ICardCost, Size } from "../../types";

export default function CardCost({ size = "sm" }: { size?: Size }) {
  const card = useCardDetails();
  const { domainImg } = getCardInfoAssets({ ...card, size });

  return <CardCostUi {...card} domainImg={domainImg} />;
}

export const CardCostUi: FC<ICardCost> = ({
  energy,
  power,
  domainImg,
  domains,
  variant = "default",
}) => {
  return (
    <div className="flex items-center gap-1 h-6">
      <div
        className={cn(
          "flex justify-center items-center rounded-full size-5 text-xs",
          variant === "default" ? "bg-black/10" : "bg-white/30"
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
                "flex justify-center items-center -ml-1.5 border border-white/10 rounded-full",
                variant === "default" ? "bg-black/10" : "bg-white/30"
              )}
            >
              {/* TODO update with next Image */}
              <img src={domainImg} alt={`${domains[0]} power image`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

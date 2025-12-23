"use client";

import { getCardInfoAssets } from "@/lib/getCardInfoAssets";
import { useCardDetails } from "./context";

type Size = "sm" | "md" | "lg";

export default function CardCost({ size = "sm" }: { size?: Size }) {
  const card = useCardDetails();
  const { power, energy, domains } = card;
  const { domainImg } = getCardInfoAssets({ ...card, size });

  return (
    <div className="flex items-center h-6 gap-1">
      <div className="flex justify-center items-center size-5 rounded-full bg-black/10 text-xs">
        {energy}
      </div>
      {power && domainImg && (
        <div className="flex ml-1">
          {Array.from({ length: power }).map((_, index) => (
            <div
              key={index}
              className="flex justify-center items-center rounded-full bg-white/10 border border-white/10 -ml-1.5"
            >
              <img src={domainImg} alt={`${domains[0]} power image`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

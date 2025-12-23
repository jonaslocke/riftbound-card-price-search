"use client";

import icon from "@/assets/icons/might-24.webp";
import { cn } from "@/lib/utils";
import { useCardDetails } from "./context";

export default function UnitCardMight() {
  const card = useCardDetails();
  const { might, rarity } = card;

  if (!might) return null;

  return (
    <div
      className={cn(
        "absolute p-0! select-none right-0 bottom-0",
        "translate-y-[30%] translate-x-[30%]"
      )}
      style={{
        filter: "drop-shadow(0 18px 30px rgba(0, 0, 0, 0.35))",
      }}
    >
      <div
        className={cn(
          "flex items-center gap-2 py-0.5 px-1.5 rounded border border-black/50",
          rarity === "common"
            ? "bg-common"
            : rarity === "uncommon"
            ? "bg-uncommon"
            : "bg-rare"
        )}
      >
        <div className="size-5">
          <img src={icon.src} alt="might symbol" className="invert" />
        </div>
        <div className="text-lg">{might}</div>
      </div>
    </div>
  );
}

"use client";

import { useI18nHelpers } from "@/app/i18n/HelpersProvider";
import icon from "@/assets/icons/might-24.webp";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useCardDetails } from "../../state/context";

export default function CardMight() {
  const { t } = useI18nHelpers();
  const card = useCardDetails();
  const { might, rarity } = card;

  if (!might) return null;

  return (
    <div
      className={cn(
        "right-0 bottom-0 absolute p-0! select-none",
        "sm:translate-y-[40%] translate-y-[50%] translate-x-[20%] sm:translate-x-[30%]"
      )}
      style={{
        filter: "drop-shadow(0 18px 30px rgba(0, 0, 0, 0.35))",
      }}
    >
      <div
        className={cn(
          "flex items-center gap-2 px-1.5 py-0.5 border border-black/50 rounded",
          rarity === "common" && "bg-common",
          rarity === "uncommon" && "bg-uncommon",
          (rarity === "rare" || rarity === "epic" || rarity === "showcase") &&
            "bg-rare"
        )}
      >
        <div className="size-5">
          <Image
            src={icon.src}
            alt={t("card.might_symbol")}
            className="invert"
            width={20}
            height={20}
          />
        </div>
        <div className="text-lg">{might}</div>
      </div>
    </div>
  );
}

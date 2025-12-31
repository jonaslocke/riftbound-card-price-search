"use client";

import { useI18nHelpers } from "@/app/i18n/HelpersProvider";
import { CirclePlus } from "lucide-react";
import { usePathname } from "next/navigation";
import { MAX_HEIGHT_CARD_DETAILS } from "../../contants";
import { useCardDetails } from "../../state/context";
import OtherPrintTile from "./OtherPrintTile";

export default function CardOtherPrintings() {
  const { t } = useI18nHelpers();
  const card = useCardDetails();
  const { otherPrintings } = card;
  const currentCard = usePathname().split("/").pop();

  if (otherPrintings.length < 1) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-center items-center gap-0.5 bg-primary py-0.5 rounded-t-lg text-white/80 tiny-font">
        <CirclePlus className="size-3" />
        <span className="leading-3">{t("card.other_printings")}</span>
      </div>
      <div
        className="flex flex-col gap-2 p-2 border-2 border-primary border-t-0 rounded-b-lg overflow-y-auto scrollbar-compact"
        style={{
          maxHeight: MAX_HEIGHT_CARD_DETAILS * 0.9,
        }}
      >
        <OtherPrintTile
          name={card.name}
          image_url={card.imageUrl}
          public_code={card.cardNumber}
          isSelected={currentCard === card.normalizedCardNumber}
          isAlteredArt={false}
          isSignature={false}
          isOverNumbered={false}
        />
        {otherPrintings.map(
          ({ riftbound_id, name, media, public_code, metadata }) => (
            <OtherPrintTile
              key={riftbound_id}
              name={name}
              image_url={media?.image_url}
              public_code={public_code}
              isAlteredArt={metadata?.alternate_art}
              isOverNumbered={metadata?.overnumbered}
              isSignature={metadata?.signature}
              isSelected={currentCard === ""}
            />
          )
        )}
      </div>
    </div>
  );
}

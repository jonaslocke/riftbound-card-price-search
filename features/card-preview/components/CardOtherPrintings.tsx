"use client";

import { useI18nHelpers } from "@/app/i18n/HelpersProvider";
import { cn } from "@/lib/utils";
import { CirclePlus } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { MAX_HEIGHT_CARD_DETAILS } from "../contants";
import { useCardDetails } from "../state/context";

const WIDTH = 63;
const HEIGHT = 86;
const OFF_SET = 20;

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

type PrintIndicator = "altered" | "overnumbered" | "signature";

const indicatorLabelKey: Record<PrintIndicator, string> = {
  altered: "card.print_indicator.altered",
  overnumbered: "card.print_indicator.overnumbered",
  signature: "card.print_indicator.signature",
};

interface OtherPrintTile {
  image_url?: string | undefined;
  name: string;
  public_code?: string | undefined;
  isSelected?: boolean;
  isAlteredArt: boolean | undefined;
  isSignature: boolean | undefined;
  isOverNumbered: boolean | undefined;
}

const OtherPrintIndicator: FC<
  Pick<OtherPrintTile, "isAlteredArt" | "isOverNumbered" | "isSignature">
> = ({ isAlteredArt, isOverNumbered, isSignature }) => {
  const { t } = useI18nHelpers();

  if (!isAlteredArt && !isOverNumbered && !isSignature) {
    return null;
  }

  const label = t(
    indicatorLabelKey[
      isAlteredArt ? "altered" : isOverNumbered ? "overnumbered" : "signature"
    ]
  );

  return (
    <div
      className={cn(
        "top-0 absolute flex justify-center items-center bg-radial to-70% to-transparent text-black text tiny-font",
        isAlteredArt && "from-teal-200",
        isOverNumbered && "from-amber-200",
        isSignature && "from-fuchsia-200"
      )}
      style={{
        width: WIDTH,
        height: HEIGHT - OFF_SET,
      }}
    >
      {label}
    </div>
  );
};

const OtherPrintTile: FC<OtherPrintTile> = ({
  image_url,
  name,
  public_code,
  isSelected = false,
  isAlteredArt,
  isSignature,
  isOverNumbered,
}) => {
  const { t } = useI18nHelpers();
  return (
    <Link href="#" className={cn("block", isSelected && "pointer-events-none")}>
      <motion.div
        className={cn(
          "relative flex flex-col items-center gap-1 bg-white border-2 border-white rounded",
          isSelected && "ring-3 ring-amber-500/80"
        )}
        style={{
          width: WIDTH,
          height: HEIGHT,
        }}
        initial={false}
        animate={{ x: 0 }}
        whileHover={isSelected ? undefined : { x: 4 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        <OtherPrintIndicator
          isAlteredArt={isAlteredArt}
          isOverNumbered={isOverNumbered}
          isSignature={isSignature}
        />
        {image_url && (
          <Image
            src={image_url}
            alt={t("card.art_alt", { name })}
            width={WIDTH}
            height={HEIGHT}
          />
        )}
        <div
          className="bottom-0 absolute flex justify-center items-end bg-linear-to-t from-55% from-white to-white/20 w-full text-black/80 uppercase tiny-font"
          style={{
            height: OFF_SET,
          }}
        >
          <span className="pb-px">{public_code}</span>
        </div>
      </motion.div>
    </Link>
  );
};

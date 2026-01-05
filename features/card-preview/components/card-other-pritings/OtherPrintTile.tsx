import { useI18nHelpers } from "@/app/i18n/HelpersProvider";
import { cn } from "@/lib/utils";
import { CardDetailsDto } from "@/src/lib/cards/card-details-dto";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { HEIGHT, OFF_SET, WIDTH } from "./constants";
import OtherPrintIndicator from "./OtherPrintIndicator";
import type { OtherPrintTile } from "./types";

interface Props
  extends Pick<
    CardDetailsDto,
    | "name"
    | "normalizedCardNumber"
    | "imageUrl"
    | "isAlteredArt"
    | "isSignature"
    | "isOverNumbered"
  > {
  href: string;
  isSelected?: boolean;
}

const OtherPrintTile: FC<Props> = ({
  href,
  isSelected = false,
  name,
  normalizedCardNumber,
  imageUrl,
  isAlteredArt,
  isSignature,
  isOverNumbered,
}) => {
  const { t } = useI18nHelpers();
  return (
    <Link
      href={href}
      className={cn("block", isSelected && "pointer-events-none")}
    >
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
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={t("card.art_alt", { name })}
            width={WIDTH}
            height={HEIGHT}
            unoptimized
          />
        )}
        <div
          className="bottom-0 absolute flex justify-center items-end bg-linear-to-t from-55% from-white to-white/20 w-full text-black/80 uppercase tiny-font"
          style={{
            height: OFF_SET,
          }}
        >
          <span className="pb-px">{normalizedCardNumber}</span>
        </div>
      </motion.div>
    </Link>
  );
};

export default OtherPrintTile;

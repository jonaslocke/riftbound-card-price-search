import { useI18nHelpers } from "@/app/i18n/HelpersProvider";
import { FC } from "react";
import { HEIGHT, indicatorLabelKey, OFF_SET, WIDTH } from "./constants";
import { OtherPrintTile } from "./types";
import { cn } from "@/lib/utils";

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

export default OtherPrintIndicator;

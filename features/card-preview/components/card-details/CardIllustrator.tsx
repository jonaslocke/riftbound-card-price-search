"use client";

import type { CardDomain } from "@/app/types/card";
import { cn } from "@/lib/utils";
import { Brush } from "lucide-react";
import { useI18nHelpers } from "@/app/i18n/HelpersProvider";
import { useCardDetails } from "../../state/context";
import { backgroundColorMap, domainColorVars } from "../../contants";

export default function CardIllustrator() {
  const { t } = useI18nHelpers();
  const { artistLabel, domains } = useCardDetails();
  const primaryDomain = domains[0];
  const secondaryDomain = domains[1];
  const hasGradient = Boolean(primaryDomain && secondaryDomain);
  const backgroundColor = primaryDomain
    ? backgroundColorMap[primaryDomain]
    : "bg-black";
  const backgroundGradient = hasGradient
    ? `linear-gradient(90deg, ${domainColorVars[primaryDomain]}, ${domainColorVars[secondaryDomain]})`
    : null;
  const useLightText = !(primaryDomain === "order" && !hasGradient);

  return (
    <div
      className={cn(
        backgroundColor,
        "-mx-px flex items-center gap-2 pl-3! border-0!",
        useLightText && "text-white"
      )}
      style={
        backgroundGradient ? { backgroundImage: backgroundGradient } : undefined
      }
    >
      <Brush className="size-4" />
      <span className="text-xs italic">
        {t("card.illustrated_by", { artist: artistLabel })}
      </span>
    </div>
  );
}

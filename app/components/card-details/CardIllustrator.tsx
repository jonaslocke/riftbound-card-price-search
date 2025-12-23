"use client";

import { Brush } from "lucide-react";
import type { CardDomain } from "@/app/types/card";
import { cn } from "@/lib/utils";
import { useCardDetails } from "./context";

const backgroundColorMap: Record<CardDomain, string> = {
  order: "bg-order",
  body: "bg-body",
  calm: "bg-calm",
  chaos: "bg-chaos",
  fury: "bg-fury",
  mind: "bg-mind",
};

const domainColorVars: Record<CardDomain, string> = {
  order: "var(--color-order)",
  body: "var(--color-body)",
  calm: "var(--color-calm)",
  chaos: "var(--color-chaos)",
  fury: "var(--color-fury)",
  mind: "var(--color-mind)",
};

export default function CardIllustrator() {
  const { artistLabel, domains } = useCardDetails();
  const primaryDomain = domains[0];
  const secondaryDomain = domains[1];
  const hasGradient = Boolean(primaryDomain && secondaryDomain);
  const backgroundColor = primaryDomain
    ? backgroundColorMap[primaryDomain]
    : "bg-black";
  const backgroundGradient =
    hasGradient && primaryDomain && secondaryDomain
      ? `linear-gradient(90deg, ${domainColorVars[primaryDomain]}, ${domainColorVars[secondaryDomain]})`
      : null;
  const useLightText = !(primaryDomain === "order" && !hasGradient);

  return (
    <div
      className={cn(
        backgroundColor,
        "-mx-px flex items-center gap-2 pl-3!",
        useLightText && "text-white"
      )}
      style={backgroundGradient ? { backgroundImage: backgroundGradient } : undefined}
    >
      <Brush className="size-4" />
      <span className="text-xs italic">Illustrated by: {artistLabel}</span>
    </div>
  );
}

"use client";

import type { CardDomain } from "@/app/types/card";
import { cn } from "@/lib/utils";
import { useCardDetails } from "./context";

type DomainBorderClass = `border-t-${CardDomain} border-b-${CardDomain}`;

const domainBorderColors: Record<CardDomain, DomainBorderClass> = {
  order: "border-t-order border-b-order",
  body: "border-t-body border-b-body",
  calm: "border-t-calm border-b-calm",
  chaos: "border-t-chaos border-b-chaos",
  fury: "border-t-fury border-b-fury",
  mind: "border-t-mind border-b-mind",
};

const domainColorVars: Record<CardDomain, string> = {
  order: "var(--color-order)",
  body: "var(--color-body)",
  calm: "var(--color-calm)",
  chaos: "var(--color-chaos)",
  fury: "var(--color-fury)",
  mind: "var(--color-mind)",
};

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function CardDetailsPanel({ children, className }: Props) {
  const { domains } = useCardDetails();
  const primaryDomain = domains[0];
  const secondaryDomain = domains[1];
  const hasGradient = Boolean(primaryDomain && secondaryDomain);
  const borderGradient =
    hasGradient && primaryDomain && secondaryDomain
      ? `linear-gradient(90deg, ${domainColorVars[primaryDomain]}, ${domainColorVars[secondaryDomain]})`
      : null;

  return (
    <div
      className={cn(
        "flex flex-col",
        "bg-white/75 w-96 text-black sm:-translate-x-5 sm:translate-y-5",
        "border border-t-3 border-b-0 border-slate-400",
        "*:pl-3 sm:*:pl-8 *:py-2 *:pr-3 *:border-b *:border-b-black/10",
        "mt-6 sm:mt-0",
        !hasGradient && primaryDomain && domainBorderColors[primaryDomain],
        className
      )}
      style={
        borderGradient
          ? {
              borderImage: `${borderGradient} 1`,
              borderImageSlice: 1,
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}

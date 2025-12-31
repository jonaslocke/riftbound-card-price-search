"use client";

import type { CardDomain } from "@/app/types/card";
import { cn } from "@/lib/utils";
import { useCardDetails } from "../../state/context";
import { PropsWithChildren } from "react";
import { domainBorderColors, domainColorVars } from "../../contants";

interface Props extends PropsWithChildren {
  className?: string;
}

export default function CardWrapper({ children, className }: Props) {
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
      id="card-wrapper"
      className={cn(
        "relative flex flex-col flex-1 bg-white/75 mt-6 sm:mt-0 border border-t-3 border-b-0 text-black",
        "*:py-2 *:pr-3 sm:*:pl-8 *:pl-3 *:border-b *:border-b-black/10",
        !hasGradient && primaryDomain
          ? domainBorderColors[primaryDomain]
          : "border-slate-400"
      )}
    >
      {children}
    </div>
  );

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
      id="card-details-panel"
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

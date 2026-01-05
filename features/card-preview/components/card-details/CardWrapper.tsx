"use client";

import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";
import { domainBorderColors, domainColorVars } from "../../contants";
import { useCardDetails } from "../../state/context";

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
      className={cn(
        className,
        "relative flex flex-col flex-1 order-3 bg-white/75 border-t-3 border-b-0 w-full text-black",
        "*:py-2 *:pr-3 sm:*:pl-8 *:pl-3 *:border-b *:border-b-black/10",
        !hasGradient && primaryDomain
          ? domainBorderColors[primaryDomain]
          : "border-slate-400"
      )}
      style={
        borderGradient
          ? {
              borderImage: `${borderGradient} 1`,
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}

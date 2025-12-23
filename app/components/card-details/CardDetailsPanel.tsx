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

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function CardDetailsPanel({ children, className }: Props) {
  const { domains } = useCardDetails();

  return (
    <div
      className={cn(
        "flex flex-col",
        "bg-white/75 w-[356] h-[470] text-black -translate-x-5 translate-y-5",
        "border border-t-3 border-b-0 border-slate-400",
        "*:pl-8 *:py-2 *:pr-3 *:border-b *:border-b-black/10",
        domains[0] && domainBorderColors[domains[0]],
        className
      )}
    >
      {children}
    </div>
  );
}

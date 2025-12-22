import { toCardDisplayData } from "@/lib/card-display-dto";
import type { Card, CardDomain } from "../types/card";
import { cn } from "@/lib/utils";
import CardCost from "./CardCost";

type DomainBorderClass = `border-t-${CardDomain} border-b-${CardDomain}`;

const domainBorderColors: Record<CardDomain, DomainBorderClass> = {
  order: "border-t-order border-b-order",
  body: "border-t-body border-b-body",
  calm: "border-t-calm border-b-calm",
  chaos: "border-t-chaos border-b-chaos",
  fury: "border-t-fury border-b-fury",
  mind: "border-t-mind border-b-mind",
};

export default function CardDetails(card: Card) {
  const cardDetails = toCardDisplayData(card);
  const { imageUrl, name, domains } = cardDetails;

  return (
    <div className="flex">
      <div className="z-1 w-[320]">
        <img src={imageUrl} alt={name} className="w-full" />
      </div>
      <div
        className={cn(
          "bg-white/75 w-[356] h-[470] text-black -translate-x-5 translate-y-5 pl-8 pr-3 py-2",
          "border border-t-3 border-b-3 border-slate-400",
          domains[0] && domainBorderColors[domains[0]]
        )}
      >
        <h1 className="flex justify-between">
          <span>{name}</span>
          <CardCost {...cardDetails} size="sm" />
        </h1>
      </div>
    </div>
  );
}

import { toCardDisplayData } from "@/lib/card-display-dto";
import type { Card, CardDomain } from "../types/card";
import { cn } from "@/lib/utils";

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
  const { imageUrl, name, colors } = toCardDisplayData(card);
  const domain = colors.map((c) => c.domain)[0];

  return (
    <div className="flex">
      <img src={imageUrl} alt={name} width={336} />
      <div
        className={cn(
          "bg-white/65 w-[336] border border-t-3 border-b-3 border-slate-400",
          domain && domainBorderColors[domain]
        )}
      >
        1
      </div>
    </div>
  );
}

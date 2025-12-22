import { toCardDisplayData } from "@/lib/card-display-dto";
import { cn } from "@/lib/utils";
import type { Card, CardDomain } from "../types/card";
import CardImage from "./CardImage";
import CardMainInfo from "./CardMainInfo";
import CardTitle from "./CardTitle";
import CardTypes from "./CardTypes";
import UnitCardMight from "./UnitCardMight";

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
  const { domains, might, tags } = cardDetails;

  return (
    <div className="flex relative">
      <CardImage {...cardDetails} />
      <div
        className={cn(
          "bg-white/75 w-[356] h-[470] text-black -translate-x-5 translate-y-5",
          "border border-t-3 border-b-3 border-slate-400",
          "*:pl-8 *:py-2 *:pr-3 *:border-b *:border-b-black/10",
          domains[0] && domainBorderColors[domains[0]]
        )}
      >
        <CardTitle {...cardDetails} />
        <CardMainInfo {...cardDetails} />
        {tags.length > 0 && <CardTypes {...cardDetails} />}
        {might && <UnitCardMight {...cardDetails} />}
      </div>
    </div>
  );
}

import { CardDisplayData } from "@/lib/card-display-dto";
import { CardDomain } from "../types/card";
import { cn } from "@/lib/utils";
import { Brush } from "lucide-react";

const backgroundColorMap: Record<CardDomain, string> = {
  order: "bg-order",
  body: "bg-body",
  calm: "bg-calm",
  chaos: "bg-chaos",
  fury: "bg-fury",
  mind: "bg-mind",
};

export default function CardIllustrator({
  artistLabel,
  domains,
}: CardDisplayData) {
  const domain = domains[0];
  const backgroundColor = domain ? backgroundColorMap[domain] : "bg-black";

  return (
    <div
      className={cn(
        backgroundColor,
        "-mx-px flex items-center gap-2 pl-3!",
        domain !== "order" && "text-white"
      )}
    >
      <Brush className="size-4" />
      <span className="text-xs italic">Illustrated by: {artistLabel}</span>
    </div>
  );
}

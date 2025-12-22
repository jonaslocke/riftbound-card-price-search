import { CardDisplayData } from "@/lib/card-display-dto";
import CardCost from "./CardCost";

export default function CardTitle(card: CardDisplayData) {
  return (
    <h1 className="flex justify-between ">
      <span>{card.name}</span>
      <CardCost {...card} size="sm" />
    </h1>
  );
}

"use client";

import CardCost from "./CardCost";
import { useCardDetails } from "./context";

export default function CardTitle() {
  const { name, energy } = useCardDetails();

  return (
    <h1 className="flex justify-between">
      <span>{name}</span>
      {energy && <CardCost size="sm" />}
    </h1>
  );
}

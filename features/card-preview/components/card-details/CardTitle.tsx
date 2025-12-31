"use client";

import { useCardDetails } from "../../state/context";
import CardCost from "./CardCost";

export default function CardTitle() {
  const { name, energy } = useCardDetails();

  return (
    <h1 className="flex justify-between">
      <span>{name}</span>
      {energy && <CardCost size="sm" />}
    </h1>
  );
}

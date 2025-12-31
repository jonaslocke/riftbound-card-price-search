"use client";

import { useCardDetails } from "../../state/context";

export default function CardSetAndNumber() {
  const { setLabel, cardNumber } = useCardDetails();

  return (
    <div className="flex justify-end font-medium text-black/70 text-xs">
      {/* validate height difference */}
      {setLabel} | {cardNumber}
    </div>
  );
}

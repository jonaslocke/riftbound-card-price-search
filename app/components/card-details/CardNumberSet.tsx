"use client";

import { useCardDetails } from "./context";

export default function CardNumberSet() {
  const { setLabel, cardNumber } = useCardDetails();

  return (
    <div className="text-xs flex justify-end font-medium text-black/70">
      {setLabel} | {cardNumber}
    </div>
  );
}

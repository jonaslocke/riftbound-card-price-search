"use client";

import { useCardDetails } from "../../state/context";

export default function CardSetAndNumber() {
  const { setLabel, normalizedCardNumber } = useCardDetails();

  return (
    <div className="flex justify-end font-medium text-black/70 text-xs">
      {/* TODO validate height difference */}
      {setLabel} | {normalizedCardNumber}
    </div>
  );
}

"use client";

import { transpileCardDescription } from "@/lib/transpileCardDescription";
import { useCardDetails } from "../../state/context";

export default function CardDescription() {
  const { descriptionPlain } = useCardDetails();

  return (
    <div className="flex-1 min-h-32 text-sm leading-6">
      {descriptionPlain && transpileCardDescription(descriptionPlain)}
    </div>
  );
}

"use client";

import { transpileCardDescription } from "@/lib/transpileCardDescription";
import { useCardDetails } from "./context";

export default function CardDescription() {
  const { descriptionPlain } = useCardDetails();

  if (!descriptionPlain) {
    return null;
  }

  return (
    <div className="flex-1 text-sm leading-6">
      {transpileCardDescription(descriptionPlain)}
    </div>
  );
}

"use client";

import type { Card } from "@/app/types/card";
import { toCardDetailsDto } from "@/lib/card-details-dto";
import { cn } from "@/lib/utils";
import { CardDetailsProvider } from "./context";

type Props = {
  card: Card;
  children: React.ReactNode;
  className?: string;
};

export default function CardDetailsRoot({ card, children, className }: Props) {
  const cardDetails = toCardDetailsDto(card);
  const otherPrintings = card.other_printings ?? [];

  return (
    <CardDetailsProvider value={{ ...cardDetails, otherPrintings }}>
      <div
        id="card-details-root"
        className={cn(
          "flex flex-col items-center sm:items-stretch sm:flex-row relative mb-4 mt-26 sm:mt-6",
          className
        )}
      >
        {children}
      </div>
    </CardDetailsProvider>
  );
}

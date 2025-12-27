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

  return (
    <CardDetailsProvider value={cardDetails}>
      <div
        id="card-details-root"
        className={cn("flex relative mb-4 mt-26 sm:mt-6", className)}
      >
        {children}
      </div>
    </CardDetailsProvider>
  );
}

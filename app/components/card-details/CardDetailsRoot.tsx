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
      <div className={cn("flex relative mt-4 shrink-0", className)}>{children}</div>
    </CardDetailsProvider>
  );
}

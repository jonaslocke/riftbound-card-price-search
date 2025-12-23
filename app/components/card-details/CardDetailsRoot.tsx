"use client";

import type { Card } from "@/app/types/card";
import { toCardDisplayData } from "@/lib/card-display-dto";
import { cn } from "@/lib/utils";
import { CardDetailsProvider } from "./context";

type Props = {
  card: Card;
  children: React.ReactNode;
  className?: string;
};

export default function CardDetailsRoot({ card, children, className }: Props) {
  const cardDetails = toCardDisplayData(card);

  return (
    <CardDetailsProvider value={cardDetails}>
      <div className={cn("flex relative", className)}>{children}</div>
    </CardDetailsProvider>
  );
}

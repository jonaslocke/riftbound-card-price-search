"use client";

import type { Card } from "@/app/types/card";
import { toCardDetailsDto } from "@/lib/card-details-dto";
import { cn } from "@/lib/utils";
import { CardDetailsProvider } from "../state/context";
import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  card: Card;
  className?: string;
}

export default function CardPreview({ card, children, className }: Props) {
  const cardDetails = toCardDetailsDto(card);
  const otherPrintings = card.other_printings ?? [];

  return (
    <CardDetailsProvider value={{ ...cardDetails, otherPrintings }}>
      {/* <div
        className={cn(
          "relative flex sm:flex-row flex-col items-center sm:items-stretch mt-26 sm:mt-6 mb-4",
          className
        )}
      >
        {children}
      </div> */}
      <div className={cn("flex", className)}>{children}</div>
    </CardDetailsProvider>
  );
}

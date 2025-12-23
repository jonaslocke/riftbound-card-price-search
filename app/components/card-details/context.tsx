"use client";
import { createContext, useContext } from "react";
import type { CardDisplayData } from "@/lib/card-display-dto";

const CardDetailsContext = createContext<CardDisplayData | null>(null);

export function CardDetailsProvider({
  value,
  children,
}: {
  value: CardDisplayData;
  children: React.ReactNode;
}) {
  return (
    <CardDetailsContext.Provider value={value}>
      {children}
    </CardDetailsContext.Provider>
  );
}

export function useCardDetails() {
  const context = useContext(CardDetailsContext);
  if (!context) {
    throw new Error(
      "CardDetails components must be used within <CardDetails>."
    );
  }
  return context;
}

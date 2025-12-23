"use client";
import { createContext, useContext } from "react";
import type { CardDetailsDto } from "@/app/types/card";

const CardDetailsContext = createContext<CardDetailsDto | null>(null);

export function CardDetailsProvider({
  value,
  children,
}: {
  value: CardDetailsDto;
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

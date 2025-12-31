"use client";
import { createContext, useContext } from "react";
import type { Card, CardDetailsDto } from "@/app/types/card";
import { Size } from "../types";

export type CardDetailsContextValue = CardDetailsDto & {
  otherPrintings: Card[];
};

const CardDetailsContext = createContext<CardDetailsContextValue | null>(null);

export function CardDetailsProvider({
  value,
  children,
}: {
  value: CardDetailsContextValue;
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

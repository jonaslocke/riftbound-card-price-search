import { CardDomain } from "@/app/types/card.schemas";
import { DomainBorderClass } from "./types";

export const backgroundColorMap: Record<CardDomain, string> = {
  order: "bg-order",
  body: "bg-body",
  calm: "bg-calm",
  chaos: "bg-chaos",
  fury: "bg-fury",
  mind: "bg-mind",
  colorless: "bg-black",
};

export const domainColorVars: Record<CardDomain, string> = {
  order: "var(--color-order)",
  body: "var(--color-body)",
  calm: "var(--color-calm)",
  chaos: "var(--color-chaos)",
  fury: "var(--color-fury)",
  mind: "var(--color-mind)",
  colorless: "var(--color-colorless)",
};

export const domainBorderColors: Record<CardDomain, DomainBorderClass> = {
  order: "border-t-order border-b-order",
  body: "border-t-body border-b-body",
  calm: "border-t-calm border-b-calm",
  chaos: "border-t-chaos border-b-chaos",
  fury: "border-t-fury border-b-fury",
  mind: "border-t-mind border-b-mind",
  colorless: "border-t-colorless border-b-colorless",
};

export const DETAILS_ROOT_ID = "card-details-root";

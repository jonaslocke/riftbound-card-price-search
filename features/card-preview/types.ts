import { CardDomain } from "@/app/types/card";

export type Size = "sm" | "md" | "lg";

export interface ICardCost {
  energy: number | null;
  power: number | null;
  domainImg?: string;
  domains: CardDomain[];
  variant?: "default" | "light";
}

export type DomainBorderClass = `border-t-${CardDomain} border-b-${CardDomain}`;

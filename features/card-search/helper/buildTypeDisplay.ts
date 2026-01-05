import {
  CardSupertypeSchema,
  CardTypeDisplay,
  CardTypeSchema,
} from "@/app/types/card.schemas";
import { z } from "zod";
import { normalizeFields } from "./normalizeFields";

export const buildTypeDisplay = (
  type: z.infer<typeof CardTypeSchema>,
  supertype: z.infer<typeof CardSupertypeSchema> | null
): CardTypeDisplay =>
  normalizeFields<CardTypeDisplay>(supertype ? `${supertype} ${type}` : type);

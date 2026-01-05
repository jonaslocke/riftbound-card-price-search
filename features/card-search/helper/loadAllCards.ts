import type { Card } from "@/app/types/card.schemas";
import { promises as fs } from "fs";
import path from "path";
import { CARD_SEARCH_DATA_DIR } from "../constants";

let cachedCards: Card[] | null = null;

export const loadAllCards = async (): Promise<Card[]> => {
  if (cachedCards) return cachedCards;

  const entries = await fs.readdir(CARD_SEARCH_DATA_DIR);
  const files = entries.filter((name) => name.endsWith(".json"));

  let all: Card[] = [];
  for (const file of files) {
    const fullPath = path.join(CARD_SEARCH_DATA_DIR, file);
    const content = await fs.readFile(fullPath, "utf8");
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        all = all.concat(parsed as Card[]);
      }
    } catch {
      // Ignore malformed files to keep the API responsive.
      continue;
    }
  }

  cachedCards = all;
  return all;
};

import { CARD_KEYWORDS } from "@/app/types/card.schemas";

export function extractKeywordsFromPlainText(plain: string): string[] {
  if (!plain) return [];

  const text = plain.toLowerCase();

  const found: string[] = [];

  for (const kw of CARD_KEYWORDS) {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // regex escape

    const re = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
    if (re.test(text)) found.push(kw);
  }

  return Array.from(new Set(found));
}

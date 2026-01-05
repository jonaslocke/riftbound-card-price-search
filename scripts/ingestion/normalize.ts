import { CardSchema } from "@/app/types/card.schemas";
import { extractKeywordsFromPlainText } from "./keywords";

export function normalizeAndValidateCard(raw: unknown) {
  // best effort: treat as any object for normalization step only
  const c = raw as any;

  if (c?.classification?.type) {
    c.classification.type = String(c.classification.type).toLowerCase();
  }
  if (
    c?.classification?.supertype !== null &&
    c?.classification?.supertype !== undefined
  ) {
    const st = String(c.classification.supertype).trim();
    c.classification.supertype = st.length ? st.toLowerCase() : null;
  }
  if (c?.classification?.rarity) {
    c.classification.rarity = String(c.classification.rarity).toLowerCase();
  }
  if (Array.isArray(c?.classification?.domain)) {
    c.classification.domain = c.classification.domain.map((d: unknown) =>
      String(d).toLowerCase()
    );
  }

  const plain = c?.text?.plain ? String(c.text.plain) : "";
  c.keywords = extractKeywordsFromPlainText(plain);

  return CardSchema.parse(c);
}

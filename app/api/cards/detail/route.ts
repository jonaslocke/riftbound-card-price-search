import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { Card } from "../../../types/card";
import { getSetOrderIndex } from "@/lib/set-order";

const DATA_DIR = path.join(process.cwd(), "data", "sets");
let cachedAllCards: Card[] | null = null;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const set = searchParams.get("set")?.trim();
  const numberRaw = searchParams.get("number")?.trim();
  const riftboundIdRaw = searchParams.get("riftbound_id")?.trim();

  if (!set || (!numberRaw && !riftboundIdRaw)) {
    return NextResponse.json(
      {
        error:
          "Missing query params: 'set' and one of 'number' or 'riftbound_id' are required.",
      },
      { status: 400 }
    );
  }
  if (numberRaw && numberRaw.includes("/")) {
    return NextResponse.json(
      { error: "Invalid card number format." },
      { status: 400 }
    );
  }

  const setId = set.toUpperCase();
  const filePath = path.join(process.cwd(), "data", "sets", `${setId.toLowerCase()}.json`);

  let cards: Card[];
  try {
    const content = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(content);
    cards = Array.isArray(parsed) ? (parsed as Card[]) : [];
  } catch {
    return NextResponse.json({ error: "Set not found." }, { status: 404 });
  }

  const collectorNumber = numberRaw ? parseCollectorNumber(numberRaw) : null;
  const numberUpper = numberRaw ? numberRaw.toUpperCase() : "";
  const riftboundUpper = riftboundIdRaw?.toUpperCase();

  const matchesByNumber =
    collectorNumber !== null
      ? cards.filter((item) => {
          if (!item) return false;
          if (item.set?.set_id?.toUpperCase() !== setId) return false;
          return item.collector_number === collectorNumber;
        })
      : [];

  let card: Card | undefined;

  if (riftboundUpper) {
    card = cards.find((item) => {
      if (!item) return false;
      if (item.set?.set_id?.toUpperCase() !== setId) return false;
      return item.riftbound_id?.toUpperCase() === riftboundUpper;
    });
  } else if (matchesByNumber.length > 0) {
    card = pickCardByCollectorPriority(matchesByNumber);
  } else {
    card = cards.find((item) => {
      if (!item) return false;
      if (item.set?.set_id?.toUpperCase() !== setId) return false;
      return (
        item.public_code?.toUpperCase() === numberUpper ||
        item.riftbound_id?.toUpperCase() === numberUpper
      );
    });
  }

  if (!card) {
    return NextResponse.json({ error: "Card not found." }, { status: 404 });
  }

  const allCards = await loadAllCards();
  const groupKey = getCardGroupKey(card);
  const related = groupKey
    ? allCards.filter((item) => getCardGroupKey(item) === groupKey)
    : [card];
  const other_printings = related
    .filter((item) => item.id !== card?.id)
    .sort(compareCards)
    .map((item) => ({ ...item, is_primary: isPrimaryPrint(item) }));

  return NextResponse.json({
    ...card,
    is_primary: isPrimaryPrint(card),
    other_printings,
  });
}

function parseCollectorNumber(value: string) {
  const trimmed = value.trim();
  const withoutHash = trimmed.startsWith("#") ? trimmed.slice(1) : trimmed;
  const leadingSegment = withoutHash.split("/")[0];
  const parsed = Number(leadingSegment);
  return Number.isFinite(parsed) ? parsed : null;
}

function isPrimaryPrint(card: Card) {
  return (
    !card.metadata?.alternate_art &&
    !card.metadata?.overnumbered &&
    !card.metadata?.signature
  );
}

function getCardGroupKey(card: Card) {
  const base = card.metadata?.clean_name ?? card.name ?? "";
  return normalizeKey(base);
}

function normalizeKey(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compareCards(a: Card, b: Card) {
  const setOrder = getSetOrderIndex(a.set?.set_id) - getSetOrderIndex(b.set?.set_id);
  if (setOrder !== 0) return setOrder;

  const primaryOrder =
    Number(!isPrimaryPrint(a)) - Number(!isPrimaryPrint(b));
  if (primaryOrder !== 0) return primaryOrder;

  const collectorA = Number.isFinite(a.collector_number)
    ? (a.collector_number as number)
    : Number.MAX_SAFE_INTEGER;
  const collectorB = Number.isFinite(b.collector_number)
    ? (b.collector_number as number)
    : Number.MAX_SAFE_INTEGER;
  if (collectorA !== collectorB) return collectorA - collectorB;

  const codeA = (a.public_code ?? a.riftbound_id ?? a.name ?? "").toUpperCase();
  const codeB = (b.public_code ?? b.riftbound_id ?? b.name ?? "").toUpperCase();
  return codeA.localeCompare(codeB);
}

function pickCardByPriority(cards: Card[]) {
  return [...cards].sort(compareCards)[0];
}

function compareCollectorVariants(a: Card, b: Card) {
  const signatureOrder =
    Number(Boolean(a.metadata?.signature)) - Number(Boolean(b.metadata?.signature));
  if (signatureOrder !== 0) return signatureOrder;

  const overnumberedOrder =
    Number(Boolean(a.metadata?.overnumbered)) - Number(Boolean(b.metadata?.overnumbered));
  if (overnumberedOrder !== 0) return overnumberedOrder;

  const altArtOrder =
    Number(Boolean(a.metadata?.alternate_art)) - Number(Boolean(b.metadata?.alternate_art));
  if (altArtOrder !== 0) return altArtOrder;

  return compareCards(a, b);
}

function pickCardByCollectorPriority(cards: Card[]) {
  return [...cards].sort(compareCollectorVariants)[0];
}

async function loadAllCards(): Promise<Card[]> {
  if (cachedAllCards) return cachedAllCards;

  const entries = await fs.readdir(DATA_DIR);
  const files = entries.filter((name) => name.endsWith(".json"));

  let all: Card[] = [];
  for (const file of files) {
    const fullPath = path.join(DATA_DIR, file);
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

  cachedAllCards = all;
  return all;
}

import { getSetOrderIndex } from "@/lib/set-order";
import { promises as fs } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import type { Card } from "../../../types/card";

const DATA_DIR = path.join(process.cwd(), "data", "sets");
const MIN_SIZE = 10;
const MAX_SIZE = 100;

let cachedCards: Card[] | null = null;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return NextResponse.json(
      { error: "Missing query param 'q'" },
      { status: 400 }
    );
  }

  const sizeRaw = Number(searchParams.get("size") ?? MIN_SIZE);
  const pageRaw = Number(searchParams.get("page") ?? 1);
  const size = clampSize(sizeRaw);
  const page =
    Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;

  const cards = await loadAllCards();
  const qNorm = query.toLowerCase();
  const matches = cards.filter((card) => {
    const nameMatch = (card.name ?? "").toLowerCase().includes(qNorm);
    if (nameMatch) return true;

    const isLegend = card.classification?.type?.toLowerCase() === "legend";
    if (!isLegend) return false;

    return (card.tags ?? []).some((tag) => tag.toLowerCase().includes(qNorm));
  });

  const primaryMatches = pickPrimaryPrints(matches);
  const total = primaryMatches.length;
  const pages = total === 0 ? 0 : Math.ceil(total / size);
  const start = (page - 1) * size;
  const items = primaryMatches.slice(start, start + size);

  return NextResponse.json({
    items,
    total,
    page,
    size,
    pages,
  });
}

function clampSize(value: number) {
  if (!Number.isFinite(value)) return MIN_SIZE;
  return Math.max(MIN_SIZE, Math.min(MAX_SIZE, Math.floor(value)));
}

async function loadAllCards(): Promise<Card[]> {
  if (cachedCards) return cachedCards;

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

  cachedCards = all;
  return all;
}

function pickPrimaryPrints(cards: Card[]) {
  const grouped = new Map<string, Card>();
  for (const card of cards) {
    const key = getCardGroupKey(card);
    const existing = grouped.get(key);
    if (!existing || compareCards(card, existing) < 0) {
      grouped.set(key, card);
    }
  }

  return Array.from(grouped.values()).sort(compareCards);
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

function isPrimaryPrint(card: Card) {
  return (
    !card.metadata?.alternate_art &&
    !card.metadata?.overnumbered &&
    !card.metadata?.signature
  );
}

function compareCards(a: Card, b: Card) {
  const setOrder =
    getSetOrderIndex(a.set?.set_id) - getSetOrderIndex(b.set?.set_id);
  if (setOrder !== 0) return setOrder;

  const primaryOrder = Number(!isPrimaryPrint(a)) - Number(!isPrimaryPrint(b));
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

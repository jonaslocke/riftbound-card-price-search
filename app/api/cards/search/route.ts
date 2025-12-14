import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

type Card = {
  id: string;
  name: string;
  set?: { set_id?: string; label?: string };
  [key: string]: unknown;
};

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
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;

  const cards = await loadAllCards();
  const qNorm = query.toLowerCase();
  const matches = cards.filter((card) =>
    (card.name ?? "").toLowerCase().includes(qNorm)
  );

  const total = matches.length;
  const pages = total === 0 ? 0 : Math.ceil(total / size);
  const start = (page - 1) * size;
  const items = matches.slice(start, start + size);

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

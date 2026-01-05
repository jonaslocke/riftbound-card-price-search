import { NextRequest, NextResponse } from "next/server";
import type { SearchResponse } from "./types";
import { clampSize } from "./helper/clampSize";
import { loadAllCards } from "./helper/loadAllCards";
import { pickPrimaryPrints } from "./helper/pickPrimaryPrints";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return NextResponse.json(
      { error: "Missing query param 'q'" },
      { status: 400 }
    );
  }

  const sizeRaw = Number(searchParams.get("size") ?? undefined);
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

  const response: SearchResponse = {
    items,
    total,
    page,
    size,
    pages,
  };

  return NextResponse.json(response);
}

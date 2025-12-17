import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

type Card = {
  collector_number?: number;
  public_code?: string;
  riftbound_id?: string;
  set?: { set_id?: string };
  [key: string]: unknown;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const set = searchParams.get("set")?.trim();
  const numberRaw = searchParams.get("number")?.trim();

  if (!set || !numberRaw) {
    return NextResponse.json(
      { error: "Missing query params: 'set' and 'number' are required." },
      { status: 400 }
    );
  }
  if (numberRaw.includes("/")) {
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

  const collectorNumber = parseCollectorNumber(numberRaw);
  const numberUpper = numberRaw.toUpperCase();

  const card = cards.find((item) => {
    if (!item) return false;
    if (item.set?.set_id?.toUpperCase() !== setId) return false;
    if (collectorNumber !== null) {
      return item.collector_number === collectorNumber;
    }
    return (
      item.public_code?.toUpperCase() === numberUpper ||
      item.riftbound_id?.toUpperCase() === numberUpper
    );
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found." }, { status: 404 });
  }

  return NextResponse.json(card);
}

function parseCollectorNumber(value: string) {
  const trimmed = value.trim();
  const withoutHash = trimmed.startsWith("#") ? trimmed.slice(1) : trimmed;
  const leadingSegment = withoutHash.split("/")[0];
  const parsed = Number(leadingSegment);
  return Number.isFinite(parsed) ? parsed : null;
}

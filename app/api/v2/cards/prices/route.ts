import { authOptions } from "@/lib/auth";
import { getCollections } from "@/lib/mongodb/collections";
import { fetchLivePrices, getCachedPrices } from "@/lib/prices/prices";
import { CardPricesResponseSchema } from "@/lib/prices/schema";
import type { CardPricesResponse } from "@/lib/prices/schema";
import { isRateLimited } from "@/lib/rateLimit";
import { promises as fs } from "fs";
import { getServerSession, type Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import type { Card } from "../../../../types/card";

const DATA_DIR = path.join(process.cwd(), "data", "sets");
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const RATE_LIMIT_WINDOW_MS = 1000;
const lastRequestBySession = new Map<string, number>();

function getSessionKey(req: NextRequest, session: Session | null) {
  const sessionUser = session?.user;
  if (
    sessionUser &&
    "id" in sessionUser &&
    typeof sessionUser.id === "string"
  ) {
    return sessionUser.id;
  }
  if (sessionUser?.email) return sessionUser.email;

  const secureToken = req.cookies.get(
    "__Secure-next-auth.session-token"
  )?.value;
  if (secureToken) return secureToken;
  return req.cookies.get("next-auth.session-token")?.value ?? null;
}

function isCacheFresh(cachedAt: Date) {
  return Date.now() - cachedAt.getTime() <= CACHE_TTL_MS;
}

function getLastKnownPriceByStore(
  payload: Pick<CardPricesResponse, "stores"> | null
) {
  const map = new Map<string, number>();
  if (!payload) return map;
  for (const store of payload.stores ?? []) {
    if (Number.isFinite(store.currentPrice)) {
      map.set(store.storeName, store.currentPrice);
    }
  }
  return map;
}

export async function GET(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const sessionKey = getSessionKey(req, session);
  if (!sessionKey) {
    return NextResponse.json(
      { error: "Session identifier missing." },
      { status: 500 }
    );
  }

  const now = Date.now();
  if (
    isRateLimited(lastRequestBySession, sessionKey, now, RATE_LIMIT_WINDOW_MS)
  ) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const riftboundIdRaw = searchParams.get("riftbound_id")?.trim();
  if (!riftboundIdRaw) {
    return NextResponse.json(
      { error: "Missing query param: 'riftbound_id' is required." },
      { status: 400 }
    );
  }

  const cardEntry = await loadCardByRiftboundId(riftboundIdRaw);
  if (!cardEntry) {
    return NextResponse.json({ error: "Card not found." }, { status: 404 });
  }

  const { card, setId } = cardEntry;
  const collector = card.collector_number;
  if (collector === undefined || !Number.isFinite(collector)) {
    return NextResponse.json(
      { error: "Card collector number missing." },
      { status: 500 }
    );
  }

  const cachedSnapshot = await getCachedPrices(riftboundIdRaw);
  if (cachedSnapshot && isCacheFresh(cachedSnapshot.cachedAt)) {
    return NextResponse.json(cachedSnapshot.payload);
  }

  const lastKnownPriceByStore = getLastKnownPriceByStore(
    cachedSnapshot?.payload ?? null
  );
  const response = await fetchLivePrices(
    card,
    setId,
    collector,
    lastKnownPriceByStore
  );

  try {
    const { cardPrices } = await getCollections();
    await cardPrices.updateOne(
      { riftboundId: riftboundIdRaw },
      {
        $set: {
          ...response,
          cachedAt: new Date(),
          riftboundId: riftboundIdRaw,
          cardName: card.name,
        },
      },
      { upsert: true }
    );
  } catch {
    // Best-effort cache write; no logging by request.
  }

  return NextResponse.json(response);
}

async function loadCardByRiftboundId(riftboundId: string) {
  const normalized = riftboundId.toUpperCase();
  let files: string[] = [];

  try {
    files = await fs.readdir(DATA_DIR);
  } catch {
    return null;
  }

  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const filePath = path.join(DATA_DIR, file);
    let cards: Card[] = [];

    try {
      const content = await fs.readFile(filePath, "utf8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) cards = parsed as Card[];
    } catch {
      continue;
    }

    const card =
      cards.find(
        (item) => item.riftbound_id?.toUpperCase() === normalized
      ) ?? null;
    if (!card) continue;

    const fileSetId = file.replace(/\.json$/i, "").toUpperCase();
    let setId: ReturnType<typeof CardPricesResponseSchema.shape.set.parse>;
    try {
      setId = CardPricesResponseSchema.shape.set.parse(
        card.set?.set_id ?? fileSetId
      );
    } catch {
      return null;
    }

    return { card, setId };
  }

  return null;
}

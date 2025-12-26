import stores from "@/data/stores.json";
import { load, type Cheerio, type CheerioAPI } from "cheerio";
import type { Element } from "domhandler";
import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import type { Card } from "../../../types/card";

type Store = { storeName: string; url: string };
type StorePrice = {
  storeName: string;
  storeUrl: string;
  cardUrl: string | null;
  quantity: number;
  price: number;
  currency: "brl";
  error?: string;
};

const STORE_LIST: Store[] = stores as Store[];
const USER_AGENT =
  "Mozilla/5.0 (compatible; RiftboundBot/1.0; +https://example.com)";
const DATA_DIR = path.join(process.cwd(), "data", "sets");
const SET_EDICAO: Record<string, number> = {
  OGN: 1,
  OGS: 2,
  SFD: 5,
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
  const edicao = SET_EDICAO[setId];
  if (!edicao) {
    return NextResponse.json(
      { error: "Unsupported set for pricing." },
      { status: 400 }
    );
  }

  const card = await loadCard(setId, numberRaw);
  if (!card) {
    return NextResponse.json({ error: "Card not found." }, { status: 404 });
  }

  const collector = card.collector_number;
  if (collector === undefined || !Number.isFinite(collector)) {
    return NextResponse.json(
      { error: "Card collector number missing." },
      { status: 500 }
    );
  }
  const ligamagicId = card.ligamagic_id ?? null;

  const tasks = STORE_LIST.map((store) =>
    fetchStorePrice(store, edicao, collector, ligamagicId)
  );
  const stores = await Promise.all(tasks);
  const inStockStores = stores.filter((store) => store.quantity > 0).length;
  stores.sort((a, b) => {
    const aHasStock = a.quantity > 0 ? 1 : 0;
    const bHasStock = b.quantity > 0 ? 1 : 0;
    if (inStockStores > 0 && aHasStock !== bHasStock) {
      return bHasStock - aHasStock;
    }
    return a.price - b.price;
  });

  return NextResponse.json({
    set: setId,
    number: collector,
    inStockStores,
    stores,
  });
}

async function loadCard(setId: string, numberRaw: string): Promise<Card | null> {
  const filePath = path.join(DATA_DIR, `${setId.toLowerCase()}.json`);
  let cards: Card[] = [];

  try {
    const content = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) cards = parsed as Card[];
  } catch {
    return null;
  }

  const collectorNumber = parseCollectorNumber(numberRaw);
  if (collectorNumber === null) return null;

  return (
    cards.find((item) => item.collector_number === collectorNumber) ?? null
  );
}

function parseCollectorNumber(value: string) {
  const trimmed = value.trim();
  const withoutHash = trimmed.startsWith("#") ? trimmed.slice(1) : trimmed;
  const leadingSegment = withoutHash.split("/")[0];
  const parsed = Number(leadingSegment);
  return Number.isFinite(parsed) ? parsed : null;
}

async function fetchStorePrice(
  store: Store,
  edicao: number,
  collector: number,
  ligamagicId: string | null
): Promise<StorePrice> {
  const storeUrl = store.url.replace(/\/+$/, "");
  const cardUrl = ligamagicId
    ? `${storeUrl}/?view=ecom/item&tcg=19&edicao=${edicao}&cardID=${collector}&card=${ligamagicId}`
    : null;

  if (!cardUrl) {
    return {
      storeName: store.storeName,
      storeUrl,
      cardUrl: null,
      quantity: 0,
      price: 0,
      currency: "brl",
      error: "Missing ligamagic_id.",
    };
  }

  try {
    const html = await fetchHtml(cardUrl);
    const { price, quantity } = parseItemPage(html);
    return {
      storeName: store.storeName,
      storeUrl,
      cardUrl,
      quantity,
      price,
      currency: "brl",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      storeName: store.storeName,
      storeUrl,
      cardUrl,
      quantity: 0,
      price: 0,
      currency: "brl",
      error: message,
    };
  }
}

async function fetchHtml(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.8",
      },
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`Fetch failed (${res.status})`);
    }

    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

function parseItemPage(html: string) {
  const $ = load(html);
  const priceText = $(".card-preco").first().text();
  const price = parsePrice(priceText);
  const quantity = extractQuantity($("body") as Cheerio<Element>, $);
  return { price, quantity };
}

function parsePrice(text: string): number {
  const match = text.match(/R?\$?\s*\d[\d.,]*/);
  if (!match) return 0;
  const normalized = match[0]
    .replace(/[^\d.,]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function extractQuantity(
  scope: Cheerio<Element>,
  $: CheerioAPI
): number {
  const attrStock =
    scope.attr("data-stock") ||
    scope.attr("data-qty") ||
    scope.attr("data-quantity") ||
    scope.attr("data-available");
  if (attrStock) {
    const parsed = Number.parseInt(attrStock, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  const estoqueCell = scope
    .find(".table-cards-body-cell")
    .filter((_, el) => /estoque/i.test($(el).text()))
    .first();
  if (estoqueCell.length) {
    const match = estoqueCell.text().match(/\d+/);
    if (match) return Number.parseInt(match[0], 10);
  }

  const textCandidates = [
    scope
      .find(
        '[class*="estoque"], [class*="stock"], [class*="quant"], [class*="qtd"]'
      )
      .first()
      .text(),
    scope
      .closest(
        '[class*="estoque"], [class*="stock"], [class*="quant"], [class*="qtd"]'
      )
      .first()
      .text(),
  ].find(Boolean);

  const quantityText = textCandidates || "";
  const match = quantityText.match(/\d+/);
  if (match) return Number.parseInt(match[0], 10);

  const lowered = quantityText.toLowerCase();
  if (
    lowered.includes("sem estoque") ||
    lowered.includes("indispon") ||
    lowered.includes("out")
  ) {
    return 0;
  }

  return 0;
}

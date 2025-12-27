import stores from "@/data/stores.json";
import { load, type Cheerio, type CheerioAPI } from "cheerio";
import type { Element } from "domhandler";
import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import type { Card } from "../../../types/card";

type Store = {
  storeName: string;
  url: string;
  storeTitle: string;
  storeImage: string;
};
type StorePrice = {
  storeName: string;
  storeUrl: string;
  storeTitle: string;
  storeImage: string | null;
  cardUrl: string | null;
  quantity: number;
  price: number;
  currency: "brl" | "usd";
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
  const [stores, tcgplayerEntry] = await Promise.all([
    Promise.all(tasks),
    fetchTcgplayerEntry(card),
  ]);
  const allStores = [tcgplayerEntry, ...stores].filter(
    (store) => store.quantity > 0
  );
  const inStockStores = allStores.length;
  const tcgplayerStore = allStores.find(
    (store) => store.storeName === "tcgplayer"
  );
  const otherStores = allStores.filter(
    (store) => store.storeName !== "tcgplayer"
  );
  otherStores.sort((a, b) => a.price - b.price);

  return NextResponse.json({
    set: setId,
    number: collector,
    inStockStores,
    stores: tcgplayerStore
      ? [tcgplayerStore, ...otherStores]
      : otherStores,
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
      storeTitle: store.storeTitle,
      storeImage: store.storeImage ?? null,
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
      storeTitle: store.storeTitle,
      storeImage: store.storeImage ?? null,
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
      storeTitle: store.storeTitle,
      storeImage: store.storeImage ?? null,
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

async function fetchTcgplayerEntry(card: Card): Promise<StorePrice> {
  const tcgplayerId = card.tcgplayer_id ?? null;
  const cardUrl = tcgplayerId
    ? `https://www.tcgplayer.com/product/${tcgplayerId}`
    : null;

  if (!tcgplayerId || !cardUrl) {
    return {
      storeName: "tcgplayer",
      storeUrl: "https://www.tcgplayer.com",
      storeTitle: "TCGplayer",
      storeImage: null,
      cardUrl: null,
      quantity: 0,
      price: 0,
      currency: "usd",
      error: "Missing tcgplayer_id.",
    };
  }

  try {
    const { price, quantity } = await fetchTcgplayerMarketData(tcgplayerId);
    return {
      storeName: "tcgplayer",
      storeUrl: "https://www.tcgplayer.com",
      storeTitle: "TCGplayer",
      storeImage: null,
      cardUrl,
      quantity,
      price,
      currency: "usd",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      storeName: "tcgplayer",
      storeUrl: "https://www.tcgplayer.com",
      storeTitle: "TCGplayer",
      storeImage: null,
      cardUrl,
      quantity: 0,
      price: 0,
      currency: "usd",
      error: message,
    };
  }
}

type TcgplayerPricePoint = {
  printingType?: string;
  marketPrice?: number | null;
  listedMedianPrice?: number | null;
};

type TcgplayerSearchResponse = {
  results?: Array<{
    results?: Array<{
      totalListings?: number;
      listings?: Array<{ quantity?: number | null }>;
      marketPrice?: number | null;
    }>;
  }>;
};

async function fetchTcgplayerMarketData(tcgplayerId: string) {
  const pricePointsUrl = `https://mpapi.tcgplayer.com/v2/product/${tcgplayerId}/pricepoints`;
  const pricePoints = await fetchJson<TcgplayerPricePoint[]>(pricePointsUrl);

  const pricePoint =
    pricePoints.find(
      (point) =>
        point.printingType?.toLowerCase() === "foil" &&
        point.marketPrice !== null &&
        point.marketPrice !== undefined
    ) ??
    pricePoints.find(
      (point) =>
        point.printingType?.toLowerCase() === "normal" &&
        point.marketPrice !== null &&
        point.marketPrice !== undefined
    ) ??
    pricePoints.find((point) => point.marketPrice !== null);

  const price = pricePoint?.marketPrice ? Number(pricePoint.marketPrice) : 0;
  const printing = pricePoint?.printingType ?? "Normal";
  const quantity = await fetchTcgplayerQuantity(tcgplayerId, printing);

  return { price, quantity };
}

async function fetchTcgplayerQuantity(
  tcgplayerId: string,
  printing: string
) {
  const searchUrl = "https://mp-search-api.tcgplayer.com/v1/search/request";
  const body = {
    algorithm: "salesSynonym",
    from: 0,
    size: 1,
    filters: { term: { productId: Number(tcgplayerId) } },
    listingFilters: { term: { printing } },
    sort: {},
  };
  const data = await fetchJson<TcgplayerSearchResponse>(searchUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = data.results?.[0]?.results?.[0];
  const totalListings = result?.totalListings ?? 0;
  const listingQuantities = (result?.listings ?? []).reduce(
    (sum, listing) => sum + (listing.quantity ?? 0),
    0
  );
  if (listingQuantities > 0 && totalListings <= (result?.listings ?? []).length) {
    return listingQuantities;
  }
  if (listingQuantities > 0 && totalListings === 0) {
    return listingQuantities;
  }
  return totalListings;
}

async function fetchJson<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json",
        ...(options.headers ?? {}),
      },
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
      ...options,
    });

    if (!res.ok) {
      throw new Error(`Fetch failed (${res.status})`);
    }

    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
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

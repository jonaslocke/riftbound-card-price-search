import { NextRequest, NextResponse } from "next/server";
import { load, type Cheerio, type CheerioAPI } from "cheerio";
import type { Element } from "domhandler";
import stores from "@/stores.json";

type Store = { storeName: string; url: string };
type CardResult = {
  title: string;
  url: string;
  price: string;
  quantity: string;
  exact?: boolean;
  source: "list" | "page";
};
type StoreResponse = {
  storeName: string;
  searchUrl: string;
  results: CardResult[];
  error?: string;
};

const STORE_LIST: Store[] = stores as Store[];
const SEARCH_SUFFIX =
  "/?view=ecom%2Fitens&searchExactMatch=&busca={query}&btnEnviar=1";
const USER_AGENT =
  "Mozilla/5.0 (compatible; RiftboundBot/1.0; +https://example.com)";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Missing query param 'q'" },
      { status: 400 }
    );
  }

  const tasks = STORE_LIST.map((store) => fetchStoreResults(store, query));
  const stores = await Promise.all(tasks);

  return NextResponse.json({ query, stores });
}

async function fetchStoreResults(
  store: Store,
  query: string
): Promise<StoreResponse> {
  const searchUrl = buildSearchUrl(store.url, query);

  try {
    const html = await fetchHtml(searchUrl);
    const results = parseResults(html, searchUrl, query);
    return { storeName: store.storeName, searchUrl, results };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      storeName: store.storeName,
      searchUrl,
      results: [],
      error: message,
    };
  }
}

function buildSearchUrl(base: string, query: string) {
  const trimmed = base.replace(/\/+$/, "");
  const encoded = encodeURIComponent(query);
  return `${trimmed}${SEARCH_SUFFIX.replace("{query}", encoded)}`;
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

function parseResults(
  html: string,
  searchUrl: string,
  query: string
): CardResult[] {
  const $ = load(html);
  const qNorm = normalize(query);
  const results: CardResult[] = [];
  const seen = new Set<string>();

  const listSelectors = [
    ".listagem-item a",
    ".listagem .item a",
    ".product a",
    ".produto a",
    "[class*=product] a",
    "[class*=item] a",
  ];

  for (const selector of listSelectors) {
    ($(selector) as Cheerio<Element>).each((index: number, el: Element) => {
      if (results.length >= 12) return;

      const titleRaw = clean($(el).text());
      if (!titleRaw) return;

      const tNorm = normalize(titleRaw);
      if (qNorm && !tNorm.includes(qNorm)) return;

      const href = $(el).attr("href");
      if (!href) return;

      const url = toAbsoluteUrl(href, searchUrl);
      if (seen.has(url)) return;
      seen.add(url);

      const parent = $(el).parent() as Cheerio<Element>;
      const price = extractPrice(parent, $);
      const quantity = extractQuantity(parent, $);

      results.push({
        title: titleRaw,
        url,
        price: price ?? "0",
        quantity: quantity ?? "0",
        exact: tNorm === qNorm,
        source: "list",
      });
    });

    if (results.length > 0) break;
  }

  if (results.length === 0) {
    ($("a") as Cheerio<Element>).each((index: number, el: Element) => {
      if (results.length >= 6) return;
      const titleRaw = clean($(el).text());
      if (!titleRaw) return;
      const tNorm = normalize(titleRaw);
      if (qNorm && !tNorm.includes(qNorm)) return;
      const href = $(el).attr("href");
      if (!href) return;
      const url = toAbsoluteUrl(href, searchUrl);
      if (seen.has(url)) return;
      seen.add(url);

      const parent = $(el).parent() as Cheerio<Element>;

      results.push({
        title: titleRaw,
        url,
        price: extractPrice(parent, $) ?? "0",
        quantity: extractQuantity(parent, $) ?? "0",
        exact: tNorm === qNorm,
        source: "list",
      });
    });
  }

  if (results.length === 0) {
    const title = clean($("h1").first().text()) || clean($("title").text());
    if (title) {
      results.push({
        title,
        url: searchUrl,
        price: extractPrice($("body") as Cheerio<Element>, $) ?? "0",
        quantity: extractQuantity($("body") as Cheerio<Element>, $) ?? "0",
        exact: normalize(title) === qNorm,
        source: "page",
      });
    }
  }

  return results;
}

function extractPrice(
  scope: Cheerio<Element>,
  $: CheerioAPI
): string | undefined {
  let priceText =
    scope
      .find('[class*="price"], [class*="preco"], [class*="valor"]')
      .first()
      .text() || "";

  if (!priceText) {
    scope.find("strong").each((index: number, el: Element) => {
      const text = $(el).text();
      if (/\d/.test(text)) {
        priceText = text;
        return false; // break out of the loop
      }
      return undefined;
    });
  }

  const match = priceText.match(/R?\$?\s*\d[\d.,]*/);
  return match ? clean(match[0]) : undefined;
}

function extractQuantity(
  scope: Cheerio<Element>,
  $: CheerioAPI
): string | undefined {
  // Common data attributes
  const attrStock =
    scope.attr("data-stock") ||
    scope.attr("data-qty") ||
    scope.attr("data-quantity") ||
    scope.attr("data-available");
  if (attrStock) return clean(attrStock);

  // Specific table layout: look for an "Estoque" cell and grab its number
  const estoqueCell = scope
    .find(".table-cards-body-cell")
    .filter((_, el) => /estoque/i.test($(el).text()))
    .first();
  if (estoqueCell.length) {
    const match = estoqueCell.text().match(/\d+/);
    if (match) return match[0];
  }

  const textCandidates = [
    scope.find('[class*="estoque"], [class*="stock"], [class*="quant"], [class*="qtd"]')
      .first()
      .text(),
    scope
      .closest('[class*="estoque"], [class*="stock"], [class*="quant"], [class*="qtd"]')
      .first()
      .text(),
  ].find(Boolean);

  const quantityText = textCandidates || "";
  const match = quantityText.match(/\d+/);
  if (match) return match[0];

  const lowered = quantityText.toLowerCase();
  if (lowered.includes("sem estoque") || lowered.includes("indispon") || lowered.includes("out")) {
    return "0";
  }

  return undefined;
}

function toAbsoluteUrl(href: string, base: string) {
  try {
    return new URL(href, base).toString();
  } catch {
    return base;
  }
}

function normalize(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function clean(input: string) {
  return input.replace(/\s+/g, " ").trim();
}

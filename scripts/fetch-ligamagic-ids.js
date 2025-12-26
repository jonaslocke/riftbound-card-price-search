/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const SET_EDICAO_MAP = {
  ogn: 1,
  ogs: 2,
  sfd: 5,
};

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    i += 1;
  }
  return args;
}

function clean(input) {
  return input.replace(/\s+/g, " ").trim();
}

function normalize(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toAbsoluteUrl(href, base) {
  try {
    return new URL(href, base).toString();
  } catch {
    return base;
  }
}

function extractParamsFromUrl(url) {
  try {
    const parsed = new URL(url);
    return {
      card: parsed.searchParams.get("card") || null,
      tcg: parsed.searchParams.get("tcg") || null,
      edicao: parsed.searchParams.get("edicao") || null,
      cardID: parsed.searchParams.get("cardID") || null,
    };
  } catch {
    return { card: null, tcg: null, edicao: null, cardID: null };
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchHtml(url, options = {}) {
  const { retries = 3, timeoutMs = 12000 } = options;
  let attempt = 0;

  while (attempt <= retries) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; RiftboundBot/1.0; +https://example.com)",
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "en-US,en;q=0.8",
        },
        cache: "no-store",
        redirect: "follow",
        signal: controller.signal,
      });

      if (res.status === 429 && attempt < retries) {
        const waitMs = 8000 + attempt * 4000;
        await sleep(waitMs);
        attempt += 1;
        continue;
      }

      if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
      const html = await res.text();
      return { html, url: res.url || url };
    } finally {
      clearTimeout(timer);
    }
  }

  throw new Error("Fetch failed (retries exhausted)");
}

function hasItemSelectors(html) {
  const $ = cheerio.load(html);
  const hasPrice = $(".card-preco").length > 0;
  let hasStock = false;
  $(".table-cards-body-cell").each((_, el) => {
    const text = $(el).text();
    const header = $(el).find(".title-mobile").text();
    if (/Estoque/i.test(text) || /Estoque/i.test(header)) {
      hasStock = true;
      return false;
    }
    return undefined;
  });
  return hasPrice && hasStock;
}

function scoreMatch(queryNorm, titleNorm) {
  if (!queryNorm || !titleNorm) return 0;
  if (titleNorm === queryNorm) return 3;
  let score = 0;
  if (titleNorm.includes(queryNorm)) score += 2;
  const qTokens = new Set(queryNorm.split(" "));
  const tTokens = new Set(titleNorm.split(" "));
  let shared = 0;
  for (const t of qTokens) if (tTokens.has(t)) shared += 1;
  score += shared / Math.max(qTokens.size, 1);
  return score;
}

function parseSearchList(html, searchUrl, query) {
  const $ = cheerio.load(html);
  const qNorm = normalize(query);
  const selectors = [
    ".listagem-item a",
    ".listagem .item a",
    ".product a",
    ".produto a",
    "[class*=product] a",
    "[class*=item] a",
  ];

  const candidates = [];
  for (const selector of selectors) {
    $(selector).each((_, el) => {
      const titleRaw = clean($(el).text());
      if (!titleRaw) return;
      const tNorm = normalize(titleRaw);
      const href = $(el).attr("href");
      if (!href) return;
      const url = toAbsoluteUrl(href, searchUrl);
      const params = extractParamsFromUrl(url);
      if (params.card) {
        const score = scoreMatch(qNorm, tNorm);
        candidates.push({ title: titleRaw, url, score, params });
      }
    });
    if (candidates.length) break;
  }

  if (!candidates.length) {
    $("a").each((_, el) => {
      const titleRaw = clean($(el).text());
      if (!titleRaw) return;
      const tNorm = normalize(titleRaw);
      const href = $(el).attr("href");
      if (!href) return;
      const url = toAbsoluteUrl(href, searchUrl);
      const params = extractParamsFromUrl(url);
      if (params.card) {
        const score = scoreMatch(qNorm, tNorm);
        candidates.push({ title: titleRaw, url, score, params });
      }
    });
  }

  return candidates;
}

function buildQueryFromName(name, stripStarter) {
  const base = name.replace(/\s*,\s*/g, " - ").trim();
  if (!stripStarter) return base;
  return base.replace(/\s*-\s*Starter\s*$/i, "").trim();
}

function getPublicCodeNumbers(card) {
  const code = String(card.public_code || "");
  const match = code.match(/^[A-Z]{3}-(\d+)\/(\d+)$/i);
  if (!match) return null;
  return { number: Number(match[1]), max: Number(match[2]) };
}

function isOvernumbered(card) {
  const parsed = getPublicCodeNumbers(card);
  if (!parsed) return false;
  return parsed.number > parsed.max;
}

function isSignature(card) {
  const code = String(card.public_code || "");
  return code.includes("*");
}

function buildItemUrl(base, edicao, cardId, ligamagicId) {
  const trimmed = base.replace(/\/+$/, "");
  return `${trimmed}/?view=ecom/item&tcg=19&edicao=${edicao}&cardID=${cardId}&card=${ligamagicId}`;
}

function buildSearchUrl(base, query) {
  const trimmed = base.replace(/\/+$/, "");
  const encoded = encodeURIComponent(query);
  return `${trimmed}/?view=ecom%2Fitens&busca=${encoded}`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const storeBase = args["store-base"] || "https://www.megageek.com.br";
  const setKey = args.set ? String(args.set).toLowerCase() : null;
  const file =
    args.file ||
    (setKey ? path.join(process.cwd(), "data", "sets", `${setKey}.json`) : null);

  if (!file || !fs.existsSync(file)) {
    console.error(
      "Missing set file. Use --set <ogn|ogs|sfd> or --file <path>."
    );
    process.exit(1);
  }

  const edicaoRaw =
    args.edicao || (setKey && SET_EDICAO_MAP[setKey]) || null;
  if (!edicaoRaw) {
    console.error("Missing --edicao (set edition number).");
    process.exit(1);
  }
  const edicao = String(edicaoRaw);

  const batchSize = Number(args.batch || 0);
  const delayMs = Number(args.delay || 800);
  const retries = Number(args.retries || 3);
  const onlyMissing = args.all ? false : true;
  const dryRun = Boolean(args["dry-run"]);
  const stripStarter = Boolean(args["strip-starter"]);
  const max = Number(args.max || 0);
  const start = Number(args.start || 0);

  const set = JSON.parse(fs.readFileSync(file, "utf8"));
  const sorted = set
    .filter((card) => Number.isFinite(Number(card.collector_number)))
    .sort((a, b) => Number(a.collector_number) - Number(b.collector_number));

  let targets = sorted;
  if (onlyMissing) {
    targets = targets.filter((card) => !card.ligamagic_id);
  }
  if (start > 0) targets = targets.slice(start);
  if (batchSize > 0) targets = targets.slice(0, batchSize);
  if (max > 0) targets = targets.slice(0, max);

  if (!targets.length) {
    console.log("No cards to process.");
    return;
  }

  let updated = 0;
  let missing = 0;

  for (const card of targets) {
    const cardId = String(card.collector_number);
    const query = buildQueryFromName(card.name, stripStarter);

    let ligamagicId = null;

    const mountedUrl = buildItemUrl(storeBase, edicao, cardId, cardId);
    try {
      const mounted = await fetchHtml(mountedUrl, { retries });
      const ok = hasItemSelectors(mounted.html);
      if (ok) ligamagicId = String(cardId);
    } catch {
      // fall back
    }

    if (!ligamagicId) {
      const searchUrl = buildSearchUrl(storeBase, query);
      try {
        const search = await fetchHtml(searchUrl, { retries });
        const okSearchPage = hasItemSelectors(search.html);

        if (okSearchPage) {
          const params = extractParamsFromUrl(search.url);
          if (params.card && params.tcg === "19" && params.edicao === edicao) {
            ligamagicId = String(params.card);
          }
        } else {
          const candidates = parseSearchList(search.html, searchUrl, query);
          const tcgEdicao = candidates.filter(
            (c) => c.params.tcg === "19" && c.params.edicao === edicao
          );
          const pool = tcgEdicao.length
            ? tcgEdicao
            : candidates.filter((c) => c.params.tcg === "19");
          const sortedPool = (pool.length ? pool : candidates).sort(
            (a, b) => b.score - a.score
          );
          const pick = sortedPool[0];
        if (pick && pick.params.card) {
          const itemUrl = buildItemUrl(
            storeBase,
            edicao,
            cardId,
            pick.params.card
          );
          const item = await fetchHtml(itemUrl, { retries });
          const okItem = hasItemSelectors(item.html);
          if (okItem) ligamagicId = String(pick.params.card);
        }

        if (!ligamagicId && isOvernumbered(card)) {
          const overMatches = candidates.filter(
            (c) => c.params.tcg === "19" && /overnumbered/i.test(c.title)
          );
          if (overMatches.length) {
            overMatches.sort((a, b) => b.score - a.score);
            const overPick = overMatches[0];
            const itemUrl = buildItemUrl(
              storeBase,
              edicao,
              cardId,
              overPick.params.card
            );
            const item = await fetchHtml(itemUrl, { retries });
            const okItem = hasItemSelectors(item.html);
            if (okItem) ligamagicId = String(overPick.params.card);
          }
        }

        if (!ligamagicId && isSignature(card)) {
          const signatureMatches = candidates.filter(
            (c) => c.params.tcg === "19" && /signature/i.test(c.title)
          );
          if (signatureMatches.length) {
            signatureMatches.sort((a, b) => b.score - a.score);
            const sigPick = signatureMatches[0];
            const itemUrl = buildItemUrl(
              storeBase,
              edicao,
              cardId,
              sigPick.params.card
            );
            const item = await fetchHtml(itemUrl, { retries });
            const okItem = hasItemSelectors(item.html);
            if (okItem) ligamagicId = String(sigPick.params.card);
          }
        }
      }
    } catch {
      // keep missing
    }
    }

    if (ligamagicId) {
      if (card.ligamagic_id !== ligamagicId) {
        card.ligamagic_id = ligamagicId;
        updated += 1;
      }
    } else {
      missing += 1;
    }

    if (!dryRun) {
      fs.writeFileSync(file, JSON.stringify(set, null, 2));
    }

    console.log(`${card.name} (#${cardId}) -> ${ligamagicId || "not found"}`);
    await sleep(delayMs);
  }

  console.log(`Done. Updated: ${updated}, Missing: ${missing}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

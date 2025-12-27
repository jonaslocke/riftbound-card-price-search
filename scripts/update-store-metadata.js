/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

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

function toAbsoluteUrl(href, base) {
  if (!href) return null;
  if (href.startsWith("//")) return `https:${href}`;
  try {
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

function needsFetch(store) {
  const titleMissing = !store.storeTitle || store.storeTitle.trim() === "";
  const imageMissing = !store.storeImage || store.storeImage.trim() === "";
  return { titleMissing, imageMissing, needs: titleMissing || imageMissing };
}

async function fetchHtml(url, timeoutMs) {
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
    if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
    const html = await res.text();
    return { html, finalUrl: res.url || url };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const file =
    args.file || path.join(process.cwd(), "data", "stores.json");
  const timeoutMs = Number(args.timeout || 15000);
  const dryRun = Boolean(args["dry-run"]);

  if (!fs.existsSync(file)) {
    console.error(`Missing stores file: ${file}`);
    process.exit(1);
  }

  const stores = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(stores)) {
    console.error("Stores file is not an array.");
    process.exit(1);
  }

  let updated = 0;
  let skipped = 0;

  for (const store of stores) {
    const { titleMissing, imageMissing, needs } = needsFetch(store);
    if (!needs) {
      skipped += 1;
      continue;
    }

    try {
      const { html, finalUrl } = await fetchHtml(store.url, timeoutMs);
      const $ = cheerio.load(html);

      if (titleMissing) {
        const title = $("title").first().text().trim();
        if (title) store.storeTitle = title;
      }

      if (imageMissing) {
        const ogImage = $('meta[property="og:image"]').attr("content");
        if (ogImage) store.storeImage = toAbsoluteUrl(ogImage, finalUrl);
      }

      updated += 1;
    } catch (err) {
      console.warn(
        `Failed to fetch ${store.storeName} (${store.url}): ${err.message}`
      );
    }
  }

  if (!dryRun) {
    fs.writeFileSync(file, JSON.stringify(stores, null, 2));
  }

  console.log(`Done. Updated: ${updated}, Skipped: ${skipped}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

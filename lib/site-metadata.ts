const siteName = "Hextech Codex";

const siteNameAlternatives = [
  "Riftbound Codex",
  "Riftbound Atlas",
  "Riftbound Vault",
  "Riftbound Index",
  "Rift Search",
];

const shortDescription =
  "Hextech Codex is a Riftbound card comparison platform to find prices, stores, and availability across the Rift.";

const longDescription =
  "Hextech Codex is a Runeterra-inspired platform for discovering Riftbound cards, comparing prices across stores, and exploring card data. Built for players, collectors, and competitive buyers.";

const keywords = [
  "riftbound cards",
  "riftbound price comparison",
  "riftbound card prices",
  "riftbound marketplace",
  "runeterra cards",
  "hextech codex",
  ...siteNameAlternatives.map((name) => name.toLowerCase()),
];

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://hextechcodex.gg";

const ogImage = "/android-chrome-512x512.png";

export const siteMetadata = {
  name: siteName,
  nameAlternatives: siteNameAlternatives,
  shortDescription,
  longDescription,
  keywords,
  url: siteUrl,
  ogImage,
};
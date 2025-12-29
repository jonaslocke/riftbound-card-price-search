const siteName = "Hextech Index";

const siteNameAlternatives = [
  "Riftbound Codex",
  "Riftbound Atlas",
  "Riftbound Vault",
  "Riftbound Index",
  "Rift Search",
];

const shortDescription =
  "Hextech Index is a Riftbound card comparison platform to find prices, stores, and availability across the Rift.";

const longDescription =
  "Hextech Index is a platform for discovering Riftbound cards, comparing prices across stores, and exploring card data. Built for players, collectors, and competitive buyers.";

const keywords = [
  "riftbound cards",
  "riftbound price comparison",
  "riftbound card prices",
  "riftbound marketplace",
  "hextech codex",
  ...siteNameAlternatives.map((name) => name.toLowerCase()),
];

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://hextechindex.com";

const ogImage = "/og-image.webp";
const ogImageWidth = 1600;
const ogImageHeight = 630;

export const siteMetadata = {
  name: siteName,
  nameAlternatives: siteNameAlternatives,
  shortDescription,
  longDescription,
  keywords,
  url: siteUrl,
  ogImage,
  ogImageWidth,
  ogImageHeight,
};

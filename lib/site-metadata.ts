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

export const siteMetadata = {
  name: siteName,
  nameAlternatives: siteNameAlternatives,
  shortDescription,
  longDescription,
  keywords,
  url: "https://hextechcodex.gg",
  ogImage: "/og/default.png",
};

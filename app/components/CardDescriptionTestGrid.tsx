import type { Card } from "@/app/types/card";
import ogn from "@/data/sets/ogn.json";
import ogs from "@/data/sets/ogs.json";
import CardDetails from "./CardDetails";

const cardNames = [
  "Stand United",
  "Stormclaw Ursine",
  "Stupefy",
  "Stacked Deck",
  "Swift Scout",
  "Sky Splitter",
  "Smoke Screen",
  "Taric, Protector",
  "Spirit's Refuge",
  "Spoils of War",
  "Sprite Call",
  "Sprite Mother",
  "Tideturner",
  "Trifarian Gloryseeker",
  "Udyr, Wildman",
  "Teemo, Scout",
  "Teemo, Strategist",
  "Thermo Beam",
  "Thousand-Tailed Watcher",
  "Rebuke",
  "Lux, Crownguard",
  "Twisted Fate, Gambler",
  "Sun Disc",
  "Unlicensed Armory",
  "Treasure Trove",
  "Iron Ballista",
];

const cardData = [...(ogn as Card[]), ...(ogs as Card[])];
const cardsByName = new Map<string, Card>();

for (const card of cardData) {
  if (!card.name || cardsByName.has(card.name)) {
    continue;
  }
  cardsByName.set(card.name, card);
}

const cards = cardNames
  .map((name) => cardsByName.get(name))
  .filter((card): card is Card => Boolean(card));

export default function CardDescriptionTestGrid() {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <p className="text-sm uppercase tracking-widest text-(--text-muted)">
          Card Description Test Set
        </p>
        <h2 className="text-2xl font-semibold text-(--text-primary)">
          22-card coverage grid
        </h2>
      </div>
      <div className="grid gap-10 lg:grid-cols-2">
        {cards.map((card) => (
          <CardDetails key={card.id ?? card.name} {...card} />
        ))}
      </div>
    </section>
  );
}

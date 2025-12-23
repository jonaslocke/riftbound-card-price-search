import type { Card } from "@/app/types/card";
import ogn from "@/data/sets/ogn.json";
import ogs from "@/data/sets/ogs.json";
import sfd from "@/data/sets/sfd.json";
import CardDetails from "@/app/components/card-details";

const cardData = [...(ogn as Card[]), ...(ogs as Card[]), ...(sfd as Card[])];
const tokenRegex = /\btoken\b/i;

const tokenCards = cardData.filter(
  (card) => card.text?.plain && tokenRegex.test(card.text.plain)
);

const cardsByName = new Map<string, Card>();
for (const card of tokenCards) {
  if (!card.name || cardsByName.has(card.name)) {
    continue;
  }
  cardsByName.set(card.name, card);
}

const spriteMother = cardData.find((card) => card.name === "Sprite Mother");
const uniqueCards = Array.from(cardsByName.values()).sort((a, b) =>
  a.name.localeCompare(b.name)
);
const cards = [
  ...(spriteMother && !cardsByName.has(spriteMother.name)
    ? [spriteMother]
    : []),
  ...uniqueCards,
].slice(0, 20);

export default function CardTokenCreationTestGrid() {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <p className="text-sm uppercase tracking-widest text-(--text-muted)">
          Token Creation Test Set
        </p>
        <h2 className="text-2xl font-semibold text-(--text-primary)">
          20-card token coverage grid
        </h2>
      </div>
      <div className="grid gap-10 lg:grid-cols-2">
        {cards.map((card) => (
          <CardDetails key={card.id ?? card.name} card={card}>
            <CardDetails.Image />
            <CardDetails.Panel>
              <CardDetails.Title />
              <CardDetails.MainInfo />
              <CardDetails.Types />
              <CardDetails.Description />
              <CardDetails.NumberSet />
              <CardDetails.Illustrator />
              <CardDetails.Might />
            </CardDetails.Panel>
          </CardDetails>
        ))}
      </div>
    </section>
  );
}

import { Card, SETS } from "@/app/types/card.schemas";
import { getCollections } from "@/lib/mongodb/collections";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { normalizeAndValidateCard } from "./normalizeAndValidateCard";

function resolveSetFile(setId: string) {
  return path.join(process.cwd(), "data", "sets", `${setId}.json`);
}

async function readSetRaw(setId: string): Promise<unknown[]> {
  const filePath = resolveSetFile(setId);
  const raw = await readFile(filePath, "utf-8");

  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error(`Invalid JSON format for ${filePath}. Expected an array.`);
  }

  return parsed as unknown[];
}

async function ensureIndexes() {
  const { cards } = await getCollections();

  // Business identity
  await cards.createIndex({ riftbound_id: 1 }, { unique: true });

  // Filter indexes
  await cards.createIndex({ "set.set_id": 1 });
  await cards.createIndex({ "classification.type": 1 });
  await cards.createIndex({ "classification.supertype": 1 });
  await cards.createIndex({ "classification.rarity": 1 });

  // multikey
  await cards.createIndex({ "classification.domain": 1 });
  await cards.createIndex({ keywords: 1 });

  // Metadata booleans
  await cards.createIndex({ "metadata.alternate_art": 1 });
  await cards.createIndex({ "metadata.overnumbered": 1 });
  await cards.createIndex({ "metadata.signature": 1 });

  await cards.createIndex({ name: "text" }, { name: "cards_name_text" });
}

export async function upsertAllCardsFromJson() {
  console.log("[cards upsert] start");
  const { cards: collection } = await getCollections();
  await ensureIndexes();

  // 1) Read all sets
  const rawSets = await Promise.all(SETS.map(readSetRaw));
  const rawCards = rawSets.flat();

  // 2) Normalize + validate
  const cards: Card[] = rawCards.map((raw) => normalizeAndValidateCard(raw));

  // 3) Bulk upsert
  const ops = cards.map((card) => ({
    updateOne: {
      filter: { riftbound_id: card.riftbound_id },
      update: { $set: card },
      upsert: true,
    },
  }));

  const BATCH_SIZE = 1000;
  for (let i = 0; i < ops.length; i += BATCH_SIZE) {
    const batch = ops.slice(i, i + BATCH_SIZE);
    await collection.bulkWrite(batch, { ordered: false });
    console.log(
      `[cards upsert] processed ${Math.min(i + BATCH_SIZE, ops.length)}/${
        ops.length
      }`
    );
  }

  console.log(`[cards upsert] done. total=${ops.length}`);
}

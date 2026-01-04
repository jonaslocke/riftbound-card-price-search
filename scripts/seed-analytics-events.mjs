import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { MongoClient } from "mongodb";

const endpoint = process.argv[2] || "http://localhost:3000/api/analytics";

const nowIso = () => new Date().toISOString();

const flowId = randomUUID();
const sessionId = randomUUID();
const anonId = randomUUID();

const base = {
  flow_id: flowId,
  session_id: sessionId,
  anonymous_id: anonId,
  user_id: null,
  page_url: "http://localhost:3000/en",
  referrer: null,
  device_type: "desktop",
  env: "dev",
  app_version: "test",
};

const loadEnvFile = (path) => {
  try {
    const raw = readFileSync(path, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const index = trimmed.indexOf("=");
      if (index === -1) continue;
      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // Ignore missing env file.
  }
};

loadEnvFile(".env.local");

const send = async (event) => {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed ${event.event_name}: ${res.status} ${text}`);
  }
  return res.status;
};

const getMongoClient = async () => {
  const uri = process.env.CONNECT_DB;
  if (!uri) {
    throw new Error("Missing CONNECT_DB in environment.");
  }
  const client = new MongoClient(uri);
  await client.connect();
  return client;
};

const build = (event_name, payload, overrides = {}) => ({
  event_name,
  event_id: randomUUID(),
  timestamp: nowIso(),
  ...base,
  ...overrides,
  payload,
});

const suggestions = [
  { card_id: "card-1", card_name: "Alpha Strike", position: 0 },
  { card_id: "card-2", card_name: "Beta Shield", position: 1 },
];

const stores = [
  {
    store_id: "store-1",
    store_name: "tcgplayer",
    price: 12.34,
    currency: "USD",
    quantity: 4,
    position: 0,
  },
  {
    store_id: "store-2",
    store_name: "cardhouse",
    price: 49.9,
    currency: "BRL",
    quantity: 2,
    position: 1,
  },
];

const events = [
  build("search_started", {
    query: "alpha",
    input_method: "typing",
    source: "search_bar",
  }),
  build("suggestions_shown", {
    query: "alpha",
    suggestions,
    latency_ms: 120,
  }),
  build("card_selected", {
    query: "alpha",
    card_id: "card-1",
    card_name: "Alpha Strike",
    selection_method: "click",
    position: 0,
  }),
  build("card_detail_viewed", {
    card_id: "card-1",
    card_name: "Alpha Strike",
    auth_state: "anonymous",
  }),
  build("login_started", {}),
  build(
    "login_completed",
    { auth_method: "google" },
    { user_id: "user-123" }
  ),
  build(
    "card_detail_viewed",
    { card_id: "card-1", card_name: "Alpha Strike", auth_state: "authenticated" },
    { user_id: "user-123" }
  ),
  build(
    "prices_shown",
    {
      card_id: "card-1",
      card_name: "Alpha Strike",
      stores,
      price_count: stores.length,
      latency_ms: 240,
    },
    { user_id: "user-123" }
  ),
  build(
    "store_clicked",
    {
      card_id: "card-1",
      card_name: "Alpha Strike",
      store_id: "store-1",
      store_name: "tcgplayer",
      price: 12.34,
      currency: "USD",
      quantity: 4,
      position: 0,
    },
    { user_id: "user-123" }
  ),
];

for (const event of events) {
  const status = await send(event);
  console.log(`${event.event_name}: ${status}`);
}

const client = await getMongoClient();
try {
  const dbName = process.env.CLIENT_DB;
  if (!dbName) {
    throw new Error("Missing CLIENT_DB in environment.");
  }
  const collection = client.db(dbName).collection("analytics_events");
  const count = await collection.countDocuments({ flow_id: flowId });
  const persisted = count === events.length;
  console.log(`Persisted: ${persisted} (${count}/${events.length})`);
  await collection.deleteMany({ flow_id: flowId });
  console.log("Cleanup complete.");
} finally {
  await client.close();
}

console.log("Done. flow_id:", flowId);

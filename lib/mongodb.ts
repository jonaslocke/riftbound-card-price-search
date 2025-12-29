import { MongoClient } from "mongodb";

function requireEnv(name: "CONNECT_DB" | "CLIENT_DB") {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name} in environment.`);
  }
  return value;
}

const uri = requireEnv("CONNECT_DB");
const dbName = requireEnv("CLIENT_DB");

type MongoClientCache = {
  client?: MongoClient;
  promise?: Promise<MongoClient>;
};

const globalCache = globalThis as typeof globalThis & {
  _mongoClientCache?: MongoClientCache;
};

const cache = globalCache._mongoClientCache ?? {};

globalCache._mongoClientCache = cache;

function getClientPromise() {
  if (!cache.promise) {
    cache.client = new MongoClient(uri);
    cache.promise = cache.client.connect();
  }
  return cache.promise;
}

export async function getDb() {
  const client = await getClientPromise();
  return client.db(dbName);
}

import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Card } from "../../types/card";
import CardDisplay from "../../components/CardDisplay";

export const dynamic = "force-dynamic";

type CardPageParams = { slug?: string };

export default async function CardPage({
  params,
}: {
  params: Promise<CardPageParams> | CardPageParams;
}) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug;
  const { setId, collector } = parseSlug(slug);
  if (!setId || !collector) {
    notFound();
  }

  const card = await fetchCard(setId, collector);
  if (!card) notFound();

  return (
    <main className="card-shell card-shell--detail">
      <CardDisplay card={card} />
    </main>
  );
}

function parseSlug(slug?: string) {
  if (typeof slug !== "string" || slug.trim() === "") {
    return { setId: null, collector: null };
  }
  const parts = slug.split("-");
  if (parts.length < 2) return { setId: null, collector: null };
  const setId = parts[0]?.toUpperCase();
  const collectorRaw = parts.slice(1).join("-");
  const collectorNum = Number(collectorRaw);
  const collector = Number.isFinite(collectorNum) ? collectorNum : collectorRaw;
  return { setId, collector };
}

async function fetchCard(setId: string, collector: number | string) {
  const headersList = await headers();
  const host = headersList.get("host");
  if (!host) return null;
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const number = encodeURIComponent(collector.toString());
  const url = `${protocol}://${host}/api/cards/detail?set=${encodeURIComponent(
    setId
  )}&number=${number}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const card = (await res.json()) as Card;
    return card ?? null;
  } catch {
    return null;
  }
}

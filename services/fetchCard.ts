import { Card } from "@/app/types/card.schemas";
import { headers } from "next/headers";

export async function fetchCard(
  setId: string,
  collector: number | string | null,
  riftboundId?: string | null
) {
  const headersList = await headers();
  const host = headersList.get("host");
  if (!host) return null;
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const params = new URLSearchParams({ set: setId });
  if (riftboundId) {
    params.set("riftbound_id", riftboundId);
  } else if (collector != null) {
    params.set("number", collector.toString());
  } else {
    return null;
  }
  const url = `${protocol}://${host}/api/cards/detail?${params.toString()}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const card = (await res.json()) as Card;
    return card ?? null;
  } catch {
    return null;
  }
}

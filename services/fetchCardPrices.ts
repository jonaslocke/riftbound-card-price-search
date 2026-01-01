import type { CardPricesResponseDto } from "@/app/types/card";
import { headers } from "next/headers";

export async function fetchCardPrices(
  setId: string,
  collector: number | string | null,
  riftboundId?: string | null
) {
  const headersList = await headers();
  const host = headersList.get("host");
  if (!host) return null;
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const cookie = headersList.get("cookie");
  const params = new URLSearchParams({ set: setId });
  if (riftboundId) {
    params.set("riftbound_id", riftboundId);
  } else if (collector != null) {
    params.set("number", collector.toString());
  } else {
    return null;
  }
  const url = `${protocol}://${host}/api/v1/cards/prices?${params.toString()}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: cookie ? { cookie } : undefined,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as CardPricesResponseDto;
    return data ?? null;
  } catch {
    return null;
  }
}

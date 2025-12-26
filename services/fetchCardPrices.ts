import type { CardPricesResponseDto } from "@/app/types/card";
import { headers } from "next/headers";

export async function fetchCardPrices(
  setId: string,
  collector: number | string
) {
  const headersList = await headers();
  const host = headersList.get("host");
  if (!host) return null;
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const number = encodeURIComponent(collector.toString());
  const url = `${protocol}://${host}/api/cards/prices?set=${encodeURIComponent(
    setId
  )}&number=${number}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as CardPricesResponseDto;
    return data ?? null;
  } catch {
    return null;
  }
}

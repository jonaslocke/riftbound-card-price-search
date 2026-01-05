import { CardPricesResponseDto } from "@/app/components/analytics/CardDetailAnalytics";
import { headers } from "next/headers";

export async function fetchCardPrices(
  _setId: string,
  _collector: number | string | null,
  riftboundId?: string | null
) {
  const headersList = await headers();
  const host = headersList.get("host");
  if (!host) return null;
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const cookie = headersList.get("cookie");
  if (!riftboundId) return null;
  const params = new URLSearchParams({ riftbound_id: riftboundId });
  const url = `${protocol}://${host}/api/v2/cards/prices?${params.toString()}`;

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

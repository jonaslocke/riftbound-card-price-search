import { AdvancedSearchResponse } from "@/features/card-search";

export const fetchCardSuggestions = async (
  q: string,
  signal?: AbortSignal
): Promise<AdvancedSearchResponse> => {
  const url = `/api/v2/cards/search?q=${encodeURIComponent(q)}&page=1&size=10`;

  const res = await fetch(url, { method: "GET", signal });

  if (!res.ok) {
    let msg = "Could not search right now.";
    try {
      const body = await res.json();
      if (typeof body?.error === "string") msg = body.error;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
};

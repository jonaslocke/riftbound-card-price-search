import type { Document } from "mongodb";
import type { AdvancedSearchQuery } from "../types";

export const buildSort = (query: AdvancedSearchQuery): Document => {
  if (query.sort === "relevance" && query.q) {
    return { score: { $meta: "textScore" }, name: 1 };
  }
  const dir = query.order === "desc" ? -1 : 1;
  return { name: dir };
};

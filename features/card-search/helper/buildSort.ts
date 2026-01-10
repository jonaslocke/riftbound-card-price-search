import type { Document } from "mongodb";
import type { AdvancedSearchQuery } from "../types";

export const buildSort = (query: AdvancedSearchQuery): Document => {
  const dir = query.order === "desc" ? -1 : 1;

  if (query.sort === "relevance") {
    return { name: 1 };
  }

  return { name: dir };
};

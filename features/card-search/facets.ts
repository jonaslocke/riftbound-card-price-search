import { Document } from "mongodb";
import { FACET_DEFS } from "./constants";
import { facetGroupPipeline } from "./helper/facetGroupPipeline";

export function buildFacetStages(): Record<string, Document[]> {
  return Object.fromEntries(
    FACET_DEFS.map((definition) => [
      definition.name,
      facetGroupPipeline(definition.path, definition.unwind),
    ])
  );
}

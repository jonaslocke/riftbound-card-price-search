import type { Document } from "mongodb";

type FacetDef = {
  name: string;
  path: string;
  unwind?: boolean;
};

const facetGroupPipeline = (path: string, unwind?: boolean): Document[] => {
  const normalizedPath = path.replace(/^\$?/, ""); // ensure no leading $
  const stages: Document[] = [];

  if (unwind) stages.push({ $unwind: `$${normalizedPath}` });

  stages.push(
    { $group: { _id: `$${normalizedPath}`, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  );

  return stages;
};

export function buildFacetStages(): Record<string, Document[]> {
  const defs: FacetDef[] = [
    { name: "sets", path: "set.set_id" },
    { name: "types", path: "classification.type" },
    { name: "supertypes", path: "classification.supertype" },
    { name: "rarities", path: "classification.rarity" },

    // arrays -> unwind for per-value buckets
    { name: "domains", path: "classification.domain", unwind: true },
    { name: "keywords", path: "keywords", unwind: true },

    // booleans
    { name: "alternateArt", path: "metadata.alternate_art" },
    { name: "overNumbered", path: "metadata.overnumbered" },
    { name: "signature", path: "metadata.signature" },
  ];

  return Object.fromEntries(
    defs.map((d) => [d.name, facetGroupPipeline(d.path, d.unwind)])
  );
}

export type FacetBucket = { _id: string | boolean | null; count: number };

export type FacetsDto = {
  sets: FacetBucket[];
  types: FacetBucket[];
  supertypes: FacetBucket[];
  rarities: FacetBucket[];
  domains: FacetBucket[];
  keywords: FacetBucket[];
  alternateArt: FacetBucket[];
  overNumbered: FacetBucket[];
  signature: FacetBucket[];
};

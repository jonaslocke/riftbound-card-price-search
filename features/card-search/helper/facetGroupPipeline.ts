import type { Document } from "mongodb";

export const facetGroupPipeline = (
  path: string,
  unwind?: boolean
): Document[] => {
  const normalizedPath = path.replace(/^\$?/, ""); // ensure no leading $
  const stages: Document[] = [];

  if (unwind) stages.push({ $unwind: `$${normalizedPath}` });

  stages.push(
    { $group: { _id: `$${normalizedPath}`, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  );

  return stages;
};

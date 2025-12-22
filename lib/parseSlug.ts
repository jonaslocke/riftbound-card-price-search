export function parseSlug(slug?: string) {
  if (typeof slug !== "string" || slug.trim() === "") {
    return { setId: null, collector: null };
  }
  const parts = slug.split("-");
  if (parts.length < 2) return { setId: null, collector: null };
  const setId = parts[0]?.toUpperCase();
  const collectorRaw = parts.slice(1).join("-");
  const collectorNum = Number(collectorRaw);
  const collector = Number.isFinite(collectorNum) ? collectorNum : collectorRaw;
  return { setId, collector };
}

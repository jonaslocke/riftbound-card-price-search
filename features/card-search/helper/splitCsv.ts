export const splitCsv = (value: unknown) => {
  if (typeof value !== "string") return undefined;
  const entries = value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  return entries.length ? entries : undefined;
};

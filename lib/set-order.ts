export const SET_RELEASE_ORDER = ["OGS", "OGN", "SFD"] as const;

export function getSetOrderIndex(setId?: string | null) {
  if (!setId) return SET_RELEASE_ORDER.length + 1;
  const normalized = setId.toUpperCase();
  const index = SET_RELEASE_ORDER.indexOf(
    normalized as (typeof SET_RELEASE_ORDER)[number]
  );
  return index === -1 ? SET_RELEASE_ORDER.length + 1 : index;
}

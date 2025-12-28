export const LAST_KNOWN_PATH_KEY = "rift-last-path";

export const readLastKnownPath = (fallback?: string) => {
  if (typeof window === "undefined") return fallback;
  const stored = window.localStorage.getItem(LAST_KNOWN_PATH_KEY);
  return stored ?? fallback;
};

export const writeLastKnownPath = (path: string) => {
  if (typeof window === "undefined") return;
  if (!path) return;
  window.localStorage.setItem(LAST_KNOWN_PATH_KEY, path);
};

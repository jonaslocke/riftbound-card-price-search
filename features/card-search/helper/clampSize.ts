import {
  CARD_SEARCH_MAX_SIZE,
  CARD_SEARCH_MIN_SIZE,
} from "../constants";

export const clampSize = (value: number) => {
  if (!Number.isFinite(value)) return CARD_SEARCH_MIN_SIZE;
  return Math.max(
    CARD_SEARCH_MIN_SIZE,
    Math.min(CARD_SEARCH_MAX_SIZE, Math.floor(value))
  );
};

import { Trend } from "./types";

export const trendColor: Record<Trend, string> = {
  up: "text-rose-600 border-rose-600",
  new: "text-sky-600 border-sky-600",
  stable: "border-black/40",
  down: "text-emerald-600 border-emerald-600",
};

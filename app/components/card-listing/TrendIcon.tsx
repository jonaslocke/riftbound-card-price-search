"use client";

import { cn } from "@/lib/utils";
import {
  MinusIcon,
  SparklesIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { FC } from "react";
import { Trend } from "./types";
import { trendColor } from "./constants";

export const TrendIcon: FC<{ trend: Trend }> = ({ trend }) => {
  const classes = cn(
    "flex justify-center items-center bg-white/20 border rounded size-[16px] sm:size-[20px] *:size-[12px]",
    trendColor[trend]
  );
  switch (trend) {
    case "new":
      return (
        <div className={cn(classes)}>
          <SparklesIcon />
        </div>
      );
    case "up":
      return (
        <div className={cn(classes)}>
          <TrendingUp />
        </div>
      );
    case "down":
      return (
        <div className={cn(classes)}>
          <TrendingDown />
        </div>
      );
    default:
      return (
        <div className={cn(classes)}>
          <MinusIcon />
        </div>
      );
  }
};

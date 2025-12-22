import React from "react";
import { getKeywordImage } from "@/lib/getKeywordImage";
import type { CardKeyword } from "@/app/types/card";

type Size = "md" | "lg";

const keywordSet = new Set<CardKeyword>([
  "accelerate",
  "action",
  "add",
  "assault",
  "deathknell",
  "deflect",
  "equip",
  "ganking",
  "hidden",
  "legion",
  "mighty",
  "quick-draw",
  "reaction",
  "repeat",
  "shield",
  "tank",
  "temporary",
  "vision",
  "weaponmaster",
]);

export function transpileCardDescription(
  text: string,
  { size = "md" }: { size?: Size } = {}
) {
  const parts: React.ReactNode[] = [];
  const regex = /\[([^\]]+)\]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const content = match[1].trim();
    const keywordMatch = content.match(/^([A-Za-z-]+)(?:\s+(\d+))?$/);

    if (keywordMatch) {
      const keyword = keywordMatch[1].toLowerCase() as CardKeyword;
      const count = keywordMatch[2];

      if (keywordSet.has(keyword)) {
        const src = getKeywordImage({ keyword, size });
        parts.push(
          <span
            className="inline-flex items-center gap-1 align-middle"
            key={`${keyword}-${match.index}`}
          >
            <img
              src={src}
              alt={keyword}
              className="h-4 w-auto object-contain"
            />
            {count ? (
              <span className="flex justify-center items-center size-5 rounded-full bg-black/10 text-xs">
                {count}
              </span>
            ) : null}
          </span>
        );
        lastIndex = regex.lastIndex;
        continue;
      }
    }

    parts.push(match[0]);
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

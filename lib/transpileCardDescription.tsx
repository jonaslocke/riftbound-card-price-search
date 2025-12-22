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
  const normalizedText = text.replace(/\.\)(?=[A-Z])/g, ".)\n");
  const regex = /\[([^\]]+)\]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const pushText = (value: string) => {
    const lines = value.split("\n");
    lines.forEach((line, index) => {
      if (index > 0) {
        parts.push(<br key={`br-${parts.length}-${index}`} />);
      }
      if (!line) {
        return;
      }
      const segments = line.split(/(\([^)]*\))/g);
      segments.forEach((segment, segmentIndex) => {
        if (!segment) {
          return;
        }
        if (segment.startsWith("(") && segment.endsWith(")")) {
          parts.push(
            <span
              className="text-xs italic text-slate-600"
              key={`paren-${parts.length}-${segmentIndex}`}
            >
              {segment}
            </span>
          );
        } else {
          parts.push(segment);
        }
      });
    });
  };

  while ((match = regex.exec(normalizedText)) !== null) {
    if (match.index > lastIndex) {
      pushText(normalizedText.slice(lastIndex, match.index));
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

    pushText(match[0]);
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < normalizedText.length) {
    pushText(normalizedText.slice(lastIndex));
  }

  return parts;
}

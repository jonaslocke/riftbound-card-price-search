import React from "react";
import { getKeywordImage } from "@/lib/getKeywordImage";
import type { CardKeyword } from "@/app/types/card";
import exhaustIcon from "@/assets/icons/exhaust-24.webp";
import mightIcon from "@/assets/icons/might-24.webp";
import bodyRune from "@/assets/domains/body-16.webp";
import calmRune from "@/assets/domains/calm-16.webp";
import chaosRune from "@/assets/domains/chaos-16.webp";
import furyRune from "@/assets/domains/fury-16.webp";
import mindRune from "@/assets/domains/mind-16.webp";
import orderRune from "@/assets/domains/order-16.webp";
import rainbowRune from "@/assets/domains/rainbow-16.webp";

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

  const renderToken = (token: string) => {
    const energyMatch = token.match(/^:rb_energy_(\d+):$/);
    if (energyMatch) {
      return (
        <span
          className="inline-flex justify-center items-center size-5 rounded-full bg-black/10 text-xs"
          key={`energy-${parts.length}-${energyMatch[1]}`}
        >
          {energyMatch[1]}
        </span>
      );
    }

    if (token === ":rb_exhaust:") {
      return (
        <img
          src={exhaustIcon.src}
          alt="exhaust"
          className="inline-block h-4 w-4 object-contain align-middle invert"
          key={`exhaust-${parts.length}`}
        />
      );
    }

    if (token === ":rb_might:") {
      return (
        <img
          src={mightIcon.src}
          alt="might"
          className="inline-block h-4 w-4 object-contain align-middle invert"
          key={`might-${parts.length}`}
        />
      );
    }

    const runeMatch = token.match(/^:rb_rune_([a-z]+):$/);
    if (runeMatch) {
      const runeMap: Record<string, { src: string }> = {
        body: bodyRune,
        calm: calmRune,
        chaos: chaosRune,
        fury: furyRune,
        mind: mindRune,
        order: orderRune,
        rainbow: rainbowRune,
      };
      const rune = runeMap[runeMatch[1]];
      if (rune) {
        return (
          <img
            src={rune.src}
            alt={`${runeMatch[1]} rune`}
            className="inline-block h-4 w-4 object-contain align-middle"
            key={`rune-${parts.length}-${runeMatch[1]}`}
          />
        );
      }
    }

    return token;
  };

  const renderTokens = (value: string) => {
    const tokenRegex = /(:rb_[a-z0-9_]+:)/g;
    return value.split(tokenRegex).map((segment) => {
      if (segment.startsWith(":rb_") && segment.endsWith(":")) {
        return renderToken(segment);
      }
      return segment;
    });
  };

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
              {renderTokens(segment)}
            </span>
          );
        } else {
          parts.push(...renderTokens(segment));
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

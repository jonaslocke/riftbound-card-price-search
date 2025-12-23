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
  const normalizedText = text;
  let hasContent = false;
  let lastWasBreak = false;
  let lastNonSpaceChar: string | null = null;
  let lastWasToken = false;
  let lastWasTokenSeparator = false;
  let tokenIndex = 0;
  const emDash = "\u2014";

  const nextTokenKey = (prefix: string, suffix?: string) => {
    const key = `${prefix}-${tokenIndex}`;
    tokenIndex += 1;
    return suffix ? `${key}-${suffix}` : key;
  };

  const renderToken = (token: string) => {
    const energyMatch = token.match(/^:rb_energy_(\d+):$/);
    if (energyMatch) {
      return (
        <span
          className="inline-flex justify-center items-center size-5 rounded-full bg-black/10 text-xs"
          data-token="rb"
          key={nextTokenKey("energy", energyMatch[1])}
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
          data-token="rb"
          className="inline-block h-4 w-4 object-contain align-middle invert"
          key={nextTokenKey("exhaust")}
        />
      );
    }

    if (token === ":rb_might:") {
      return (
        <img
          src={mightIcon.src}
          alt="might"
          data-token="rb"
          className="inline-block h-4 w-4 object-contain align-middle invert"
          key={nextTokenKey("might")}
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
            data-token="rb"
            className="inline-block h-4 w-4 object-contain align-middle"
            key={nextTokenKey("rune", runeMatch[1])}
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

  const pushBreak = () => {
    if (!lastWasBreak) {
      parts.push(<br key={`br-${parts.length}`} />);
      lastWasBreak = true;
    }
  };

  const updateLastNonSpaceChar = (value: string) => {
    for (let i = 0; i < value.length; i += 1) {
      if (value[i] !== " ") {
        lastNonSpaceChar = value[i];
      }
    }
  };

  const pushPiece = (piece: React.ReactNode) => {
    parts.push(piece);
    if (typeof piece === "string") {
      lastWasTokenSeparator =
        lastWasToken && piece.trimStart().startsWith(":");
      lastWasToken = false;
      if (piece.trim().length > 0) {
        hasContent = true;
        lastWasBreak = false;
        updateLastNonSpaceChar(piece);
      }
      return;
    }
    hasContent = true;
    lastWasBreak = false;
    if (React.isValidElement(piece)) {
      const element = piece as React.ReactElement<{ "data-token"?: string }>;
      lastWasToken = element.props?.["data-token"] === "rb";
    } else {
      lastWasToken = false;
    }
    lastWasTokenSeparator = false;
  };

  const pushRenderedTokens = (value: string) => {
    renderTokens(value).forEach((piece) => {
      pushPiece(piece);
    });
  };

  const pushKeyword = (keyword: CardKeyword, count?: string) => {
    if (
      hasContent &&
      !lastWasBreak &&
      isBoundaryChar(lastNonSpaceChar) &&
      !(lastNonSpaceChar === ":" && lastWasTokenSeparator)
    ) {
      pushBreak();
    }
    const src = getKeywordImage({ keyword, size });
    parts.push(
      <span
        className="inline-flex items-center gap-1 align-middle"
        key={`${keyword}-${parts.length}`}
      >
        <img src={src} alt={keyword} className="h-4 w-auto object-contain" />
        {count ? (
          <span className="flex justify-center items-center size-5 rounded-full bg-black/10 text-xs">
            {count}
          </span>
        ) : null}
      </span>
    );
    hasContent = true;
    lastWasBreak = false;
  };

  const pushInlineText = (value: string) => {
    const inlineRegex = /\[([^\]]+)\]/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = inlineRegex.exec(value)) !== null) {
      if (match.index > lastIndex) {
        pushRenderedTokens(value.slice(lastIndex, match.index));
      }

      const content = match[1].trim();
      const keywordMatch = content.match(/^([A-Za-z-]+)(?:\s+(\d+))?$/);

      if (keywordMatch) {
        const keyword = keywordMatch[1].toLowerCase() as CardKeyword;
        const count = keywordMatch[2];

        if (keywordSet.has(keyword)) {
          pushKeyword(keyword, count);
          lastIndex = inlineRegex.lastIndex;
          continue;
        }
      }

      pushRenderedTokens(match[0]);
      lastIndex = inlineRegex.lastIndex;
    }

    if (lastIndex < value.length) {
      pushRenderedTokens(value.slice(lastIndex));
    }
  };

  const renderInlineNodes = (value: string) => {
    const inlineRegex = /\[([^\]]+)\]/g;
    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    const pushTextNodes = (text: string) => {
      renderTokens(text).forEach((piece) => {
        nodes.push(piece);
      });
    };

    while ((match = inlineRegex.exec(value)) !== null) {
      if (match.index > lastIndex) {
        pushTextNodes(value.slice(lastIndex, match.index));
      }

      const content = match[1].trim();
      const keywordMatch = content.match(/^([A-Za-z-]+)(?:\s+(\d+))?$/);

      if (keywordMatch) {
        const keyword = keywordMatch[1].toLowerCase() as CardKeyword;
        const count = keywordMatch[2];

        if (keywordSet.has(keyword)) {
          const src = getKeywordImage({ keyword, size });
          nodes.push(
            <span
              className="inline-flex items-center gap-1 align-middle"
              key={`${keyword}-node-${nodes.length}`}
            >
              <img src={src} alt={keyword} className="h-4 w-auto object-contain" />
              {count ? (
                <span className="flex justify-center items-center size-5 rounded-full bg-black/10 text-xs">
                  {count}
                </span>
              ) : null}
            </span>
          );
          lastIndex = inlineRegex.lastIndex;
          continue;
        }
      }

      pushTextNodes(match[0]);
      lastIndex = inlineRegex.lastIndex;
    }

    if (lastIndex < value.length) {
      pushTextNodes(value.slice(lastIndex));
    }

    return nodes;
  };

  const findFirstNonSpaceIndex = (value: string) => {
    for (let i = 0; i < value.length; i += 1) {
      if (value[i] !== " ") {
        return i;
      }
    }
    return -1;
  };

  const findPrevNonSpaceIndex = (value: string, startIndex: number) => {
    for (let i = startIndex; i >= 0; i -= 1) {
      if (value[i] !== " ") {
        return i;
      }
    }
    return -1;
  };

  const isBoundaryChar = (char: string | null) => {
    return (
      char === "." ||
      char === "!" ||
      char === "?" ||
      char === ":" ||
      char === ";" ||
      char === ")"
    );
  };

  const isTokenColonBoundary = (value: string, index: number) => {
    if (value[index] !== ":") {
      return false;
    }
    return /:rb_[a-z0-9_]+::?$/.test(value.slice(0, index + 1));
  };

  const shouldBreakBeforeIndex = (value: string, index: number) => {
    if (index <= 0) {
      return false;
    }
    const prevIndex = findPrevNonSpaceIndex(value, index - 1);
    if (prevIndex === -1) {
      return false;
    }
    if (!isBoundaryChar(value[prevIndex])) {
      return false;
    }
    if (isTokenColonBoundary(value, prevIndex)) {
      return false;
    }
    return true;
  };

  const splitByCapitalStarts = (value: string) => {
    const pieces: Array<{ type: "text" | "break"; value?: string }> = [];
    let start = 0;

    for (let i = 1; i < value.length; i += 1) {
      const char = value[i];
      if (!isUppercase(char)) {
        continue;
      }
      if (!shouldBreakBeforeIndex(value, i)) {
        continue;
      }
      if (i > start) {
        pieces.push({ type: "text", value: value.slice(start, i) });
      }
      pieces.push({ type: "break" });
      start = i;
    }

    if (start < value.length) {
      pieces.push({ type: "text", value: value.slice(start) });
    }

    return pieces;
  };

  const splitByTokenStarts = (value: string) => {
    const pieces: Array<{ type: "text" | "break"; value?: string }> = [];
    let start = 0;
    let index = value.indexOf(":rb_", start);

    while (index !== -1) {
      const prevIndex = findPrevNonSpaceIndex(value, index - 1);
      if (prevIndex !== -1 && isBoundaryChar(value[prevIndex])) {
        if (index > start) {
          pieces.push({ type: "text", value: value.slice(start, index) });
        }
        pieces.push({ type: "break" });
        start = index;
      }
      index = value.indexOf(":rb_", index + 1);
    }

    if (start < value.length) {
      pieces.push({ type: "text", value: value.slice(start) });
    }

    return pieces;
  };

  const isListBoundaryChar = (char: string | null) => {
    return char === "." || char === emDash || char === ":";
  };

  const splitListItems = (value: string) => {
    const indices: number[] = [];
    for (let i = 1; i < value.length; i += 1) {
      if (value[i] !== "*") {
        continue;
      }
      const prevIndex = findPrevNonSpaceIndex(value, i - 1);
      if (prevIndex === -1 || !isListBoundaryChar(value[prevIndex])) {
        continue;
      }
      indices.push(i);
    }
    if (indices.length === 0) {
      return null;
    }
    const items: string[] = [];
    for (let i = 0; i < indices.length; i += 1) {
      const startIndex = indices[i] + 1;
      const endIndex = i + 1 < indices.length ? indices[i + 1] : value.length;
      items.push(value.slice(startIndex, endIndex));
    }
    return {
      before: value.slice(0, indices[0]),
      items,
    };
  };

  const pushNonListText = (value: string) => {
    const firstNonSpaceIndex = findFirstNonSpaceIndex(value);
    if (
      firstNonSpaceIndex !== -1 &&
      isUppercase(value[firstNonSpaceIndex]) &&
      hasContent &&
      !lastWasBreak &&
      isBoundaryChar(lastNonSpaceChar) &&
      !lastWasToken
    ) {
      pushBreak();
    }
    if (
      firstNonSpaceIndex !== -1 &&
      value.slice(firstNonSpaceIndex).startsWith(":rb_") &&
      hasContent &&
      !lastWasBreak &&
      isBoundaryChar(lastNonSpaceChar)
    ) {
      pushBreak();
    }

    splitByCapitalStarts(value).forEach((piece) => {
      if (piece.type === "break") {
        if (hasContent && !lastWasBreak) {
          pushBreak();
        }
        return;
      }
      if (!piece.value) {
        return;
      }
      splitByTokenStarts(piece.value).forEach((tokenPiece) => {
        if (tokenPiece.type === "break") {
          if (hasContent && !lastWasBreak) {
            pushBreak();
          }
          return;
        }
        if (!tokenPiece.value) {
          return;
        }
        pushInlineText(tokenPiece.value);
      });
    });
  };

  const pushText = (value: string) => {
    const segments = value.split(/(\([^)]*\))/g);
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
            {renderInlineNodes(segment)}
          </span>
        );
        hasContent = true;
        lastWasBreak = false;
        updateLastNonSpaceChar(segment);
      } else {
        const listData = splitListItems(segment);
        if (listData) {
          if (listData.before) {
            pushNonListText(listData.before);
          }
          if (listData.items.length > 0) {
            if (hasContent && !lastWasBreak) {
              pushBreak();
            }
            parts.push(
              <ul className="list-disc pl-4" key={`list-${parts.length}`}>
                {listData.items.map((item, index) => (
                  <li key={`list-item-${parts.length}-${index}`}>
                    {renderInlineNodes(item.trim())}
                  </li>
                ))}
              </ul>
            );
            hasContent = true;
            lastWasBreak = false;
          }
          return;
        }

        pushNonListText(segment);
      }
    });
  };

  pushText(normalizedText);

  return parts;
}

function isUppercase(char: string) {
  return char >= "A" && char <= "Z";
}

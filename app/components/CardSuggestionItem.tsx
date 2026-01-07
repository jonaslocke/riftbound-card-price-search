"use client";

import { useI18nHelpers } from "@/app/i18n/HelpersProvider";
import { Button } from "@/components/ui/button";
import { HextechImage } from "@/components/ui/hextech-image";
import { cn } from "@/lib/utils";
import { Card } from "../types/card.schemas";

type CardSuggestionItemProps = {
  card: Card;
  onSelect?: (card: Card) => void;
  className?: string;
  isActive?: boolean;
};

export default function CardSuggestionItem({
  card,
  onSelect,
  className,
  isActive = false,
}: CardSuggestionItemProps) {
  const { t } = useI18nHelpers();
  const image = card.media?.image_url;
  const meta = card.set?.set_id ?? "";
  const collector = card.collector_number ?? "";

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => onSelect?.(card)}
      data-selected={isActive}
      className={cn(
        "h-auto w-full justify-start gap-3 rounded-md px-3 py-2 text-left text-sm font-normal text-(--text-primary) transition-colors",
        "hover:bg-(--panel-strong) data-[selected=true]:bg-(--panel-strong)",
        className
      )}
    >
      <span className="flex h-14 w-10 items-center justify-center overflow-hidden rounded-md bg-(--panel-strong)">
        {image && (
          <HextechImage
            src={image}
            alt={t("card.art_alt", { name: card.name })}
            width={35}
            height={48}
          />
        )}
      </span>
      <span className="flex flex-col flex-1 gap-0.5">
        <span className="font-semibold text-(--text-primary)">{card.name}</span>
        {meta && <span className="text-sm text-(--text-muted)">{meta}</span>}
      </span>
      <span className="text-sm text-(--text-muted) tabular-nums">
        {collector}
      </span>
    </Button>
  );
}

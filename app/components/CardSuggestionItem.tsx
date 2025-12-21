import type { Card } from "../types/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CardSuggestionItemProps = {
  card: Card;
  isActive?: boolean;
  onSelect?: (card: Card) => void;
};

export default function CardSuggestionItem({
  card,
  isActive = false,
  onSelect,
}: CardSuggestionItemProps) {
  const image = card.media?.image_url;
  const meta = card.set?.set_id ?? "";
  const collector = card.collector_number ?? "";

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => onSelect?.(card)}
      className={cn(
        "h-auto w-full justify-start gap-3 rounded-md px-3 py-2 text-left text-sm font-normal text-(--text-primary) transition-colors",
        isActive
          ? "-translate-y-px bg-(--panel-strong)"
          : "hover:-translate-y-px hover:bg-(--panel-strong)"
      )}
    >
      <span className="flex h-14 w-10 items-center justify-center overflow-hidden rounded-md bg-(--panel-strong)">
        {image ? (
          <img src={image} alt="" loading="lazy" />
        ) : (
          <span className="text-xs text-(--text-muted)">No image</span>
        )}
      </span>
      <span className="flex flex-1 flex-col gap-0.5">
        <span className="font-semibold text-(--text-primary)">{card.name}</span>
        {meta ? (
          <span className="text-sm text-(--text-muted)">{meta}</span>
        ) : null}
      </span>
      <span className="text-sm text-(--text-muted) tabular-nums">
        {collector}
      </span>
    </Button>
  );
}

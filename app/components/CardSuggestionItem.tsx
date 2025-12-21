import type { Card } from "../types/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CardSuggestionItemProps = {
  card: Card;
  onSelect?: (card: Card) => void;
  className?: string;
};

export default function CardSuggestionItem({
  card,
  onSelect,
  className,
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
        "hover:bg-(--panel-strong) data-[selected=true]:bg-(--panel-strong)",
        className
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

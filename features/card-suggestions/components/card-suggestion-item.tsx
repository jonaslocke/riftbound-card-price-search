import { CommandItem } from "@/components/ui/command";
import { HextechImage } from "@/components/ui/hextech-image";
import { CardDetailsDto } from "@/features/card-search";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface Props extends CardDetailsDto {
  disabled?: boolean;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

export const CardSuggestionItem: FC<Props> = ({
  riftboundId,
  imageUrl,
  name,
  normalizedCardNumber,
  onSelect,
  disabled,
  isSelected,
}) => {
  return (
    <CommandItem
      key={riftboundId}
      value={riftboundId}
      onSelect={() => onSelect(riftboundId)}
      className="gap-8 cursor-pointer"
      disabled={disabled}
      asChild
    >
      <Link href={`/cards/${riftboundId}`}>
        <HextechImage src={imageUrl} alt={name} width={59} height={59} />
        <div className="flex flex-1 justify-between items-center pr-3 font-medium text-lg">
          <span>{`${name} | ${normalizedCardNumber}`}</span>
          {isSelected && !disabled && <ExternalLink />}
        </div>
      </Link>
    </CommandItem>
  );
};

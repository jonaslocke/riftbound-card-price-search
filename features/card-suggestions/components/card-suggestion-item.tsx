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
      className="justify-between gap-4 pr-3 data-[selected=true]:ring ring-black/30 cursor-pointer"
      disabled={disabled}
      asChild
    >
      <Link href={`/cards/${riftboundId}`}>
        <div className="h-10 overflow-hidden">
          <HextechImage src={imageUrl} alt={name} width={40} height={56} />
        </div>
        <div className={"flex flex-col flex-1 *:leading-5"}>
          <span className="font-medium text-base">{name}</span>
          <span className="text-black/70 text-xs">{normalizedCardNumber}</span>
        </div>
        {isSelected && !disabled ? <ExternalLink /> : <div />}
      </Link>
    </CommandItem>
  );
};

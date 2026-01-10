import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { CardDetailsDto } from "@/features/card-search";
import { FC, useState } from "react";
import { CardSuggestionItem } from "./card-suggestion-item";
import { CircleX, LoaderCircle } from "lucide-react";
import { CardSuggestionInput } from "./card-suggestion-input";

const SUGGESTIONS = [
  {
    riftboundId: "ogn-268-298",
    name: "Bullet Time",
    imageUrl: "/api/images/cards/ogn-268-298.png",
    imageThumbnailUrl: "/api/images/cards/ogn-268-298.webp",
    type: "signature spell",
    rarity: "epic",
    domains: ["body", "chaos"],
    setLabel: "Origins",
    normalizedCardNumber: "OGN-268",
    energy: 1,
    power: null,
    might: null,
    descriptionPlain:
      "[Action] (Play on your turn or in showdowns.)Pay any amount of :rb_rune_rainbow: to deal that much damage to all enemy units at a battlefield.",
    description:
      "[Action] (Play on your turn or in showdowns.)Pay any amount of :rb_rune_rainbow: to deal that much damage to all enemy units at a battlefield.",
    artistLabel: "Kudos Productions",
    artist: "Kudos Productions",
    tags: ["Miss Fortune"],
    keywords: ["action"],
    isAlteredArt: false,
    isOverNumbered: false,
    isSignature: false,
    cardNumber: 268,
  },
  {
    riftboundId: "ogn-122-298",
    name: "Time Warp",
    imageUrl: "/api/images/cards/ogn-122-298.png",
    imageThumbnailUrl: "/api/images/cards/ogn-122-298.webp",
    type: "spell",
    rarity: "epic",
    domains: ["mind"],
    setLabel: "Origins",
    normalizedCardNumber: "OGN-122",
    energy: 10,
    power: 4,
    might: null,
    descriptionPlain: "Take a turn after this one. Banish this.",
    description: "Take a turn after this one. Banish this.",
    artistLabel: "Kudos Productions",
    artist: "Kudos Productions",
    tags: [],
    keywords: [],
    isAlteredArt: false,
    isOverNumbered: false,
    isSignature: false,
    cardNumber: 122,
  },
];

// http://localhost:3000/api/v2/cards/search?q=time

type Props = {
  suggestions: CardDetailsDto[];
};

export const CardSuggestions: FC<Props> = ({
  suggestions = SUGGESTIONS as CardDetailsDto[],
}) => {
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedItem, setSelectedItem] =
    useState<CardDetailsDto["riftboundId"]>("");

  const onSelectItem = (id: CardDetailsDto["riftboundId"]) => {
    setDisabled(true);

    setTimeout(() => {
      setDisabled(false);
    }, 1000);

    console.log(id);
  };

  return (
    <>
      <div className="flex gap-3 bg-white p-4">
        <span>{open ? "input is focused" : "input on blur"}</span>
        <span>{query !== "" && `Search: ${query}`}</span>
        <span>{selectedItem !== "" && `Command value: ${selectedItem}`}</span>
      </div>
      <Command
        className="shadow-md mx-auto border rounded-lg max-w-120"
        onFocus={() => setOpen(true)}
        onBlur={(e) => {
          const next = e.relatedTarget as HTMLElement | null;
          if ((!next || !e.currentTarget.contains(next)) && !disabled) {
            setOpen(false);
            setSelectedItem("");
          }
        }}
        shouldFilter={false}
        value={selectedItem}
        onValueChange={setSelectedItem}
      >
        <CardSuggestionInput
          isDisabled={disabled}
          isLoading={disabled}
          query={query}
          setQuery={setQuery}
          clearFn={() => setQuery("")}
        />
        {open && suggestions.length > 0 && (
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {suggestions.map((suggestion) => (
                <CardSuggestionItem
                  key={suggestion.riftboundId}
                  {...suggestion}
                  disabled={disabled}
                  onSelect={onSelectItem}
                  isSelected={suggestion.riftboundId === selectedItem}
                />
              ))}
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    </>
  );
};

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { CardDetailsDto } from "@/features/card-search";
import { FC, useEffect, useRef, useState } from "react";
import { CardSuggestionItem } from "./card-suggestion-item";
import { CircleX, LoaderCircle } from "lucide-react";
import { CardSuggestionInput } from "./card-suggestion-input";
import { CardSuggestionWarning, Warnings } from "./card-suggestion-warning";

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
  const [warning, setWarning] = useState<Warnings>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  console.log(debounceTimer);

  const clearDebounce = () => {
    setDebouncedQuery("");
    clearTimeout(debounceTimer as NodeJS.Timeout);
    setDebounceTimer(null);
    setWarning(null);
  };

  const validateQuery = (query: string) => {
    if (query.length < 3) {
      setWarning("min-char");
      return false;
    }
    return true;
  };

  const onInput = (query: string) => {
    setQuery(query);
    clearDebounce();

    setDebounceTimer(
      setTimeout(() => {
        setDebouncedQuery(query);
      }, 700)
    );
  };

  const onSelectItem = (id: CardDetailsDto["riftboundId"]) => {
    setDisabled(true);

    setTimeout(() => {
      setDisabled(false);
    }, 1000);

    console.log(id);
  };

  const onClear = () => {
    setQuery("");
    clearDebounce();
    setWarning(null);
  };

  useEffect(() => {
    if (!debouncedQuery) return;
    const validQuery = validateQuery(debouncedQuery);

    if (validQuery) console.log("valid");
  }, [debouncedQuery]);

  return (
    <div className="mx-auto w-120">
      <div className="flex gap-3 bg-white mb-12 p-4 h-[150]">
        <span>{open ? "input is focused" : "input on blur"}</span>
        <span>{query !== "" && `Search: ${query}`}</span>
        <span>{selectedItem !== "" && `Command value: ${selectedItem}`}</span>
        <pre>{debounceTimer && `debounced timer:${debounceTimer}`}</pre>
      </div>
      <CardSuggestionWarning warning={warning} />
      <Command
        className="shadow-md border rounded-lg"
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
          setQuery={onInput}
          onClear={onClear}
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
    </div>
  );
};

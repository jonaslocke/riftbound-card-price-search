import { queryClient } from "@/app/providers/query-provider";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandList,
} from "@/components/ui/command";
import { CardDetailsDto } from "@/features/card-search";
import { useQuery } from "@tanstack/react-query";
import { FC, useMemo, useState } from "react";
import { useI18nHelpers } from "@/app/i18n/HelpersProvider";
import { fetchCardSuggestions } from "../services/fetchCardSuggestions";
import { CardSuggestionInput } from "./card-suggestion-input";
import { CardSuggestionItem } from "./card-suggestion-item";
import { CardSuggestionWarning, Warnings } from "./card-suggestion-warning";
import { useRouter } from "next/navigation";

const MOCK = [
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

type Props = {
  suggestions?: CardDetailsDto[];
};

export const CardSuggestions: FC<Props> = ({
  suggestions = MOCK as CardDetailsDto[],
}) => {
  const router = useRouter();
  const { t } = useI18nHelpers();
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

  const validQuery = useMemo(() => {
    const hasMinimumChars = debouncedQuery.length > 2;

    if (!hasMinimumChars && debouncedQuery !== "") setWarning("min-char");

    return [hasMinimumChars].every(Boolean);
  }, [debouncedQuery]);

  const { data, isFetching: isLoading } = useQuery({
    queryKey: ["card-suggestions"],
    queryFn: ({ signal }) => fetchCardSuggestions(debouncedQuery, signal),
    enabled: validQuery,
  });

  const filteredSuggestions = useMemo(() => {
    if (!validQuery || !data) {
      return suggestions;
    }

    return data.items;
  }, [validQuery, data, suggestions]);

  const shouldShowList = useMemo(() => {
    if (query !== "") return true;
    if (open) return true;
  }, [open, query]);

  const isBusy = useMemo(() => {
    return disabled || isLoading;
  }, [disabled, isLoading]);

  const clearDebounce = () => {
    setDebouncedQuery("");
    clearTimeout(debounceTimer as NodeJS.Timeout);
    setDebounceTimer(null);
    setWarning(null);
    queryClient.cancelQueries({ queryKey: ["card-suggestions"] });
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

    router.push(`/cards/${id}`);
  };

  const onClear = () => {
    setQuery("");
    clearDebounce();
    setWarning(null);
  };

  return (
    <div className="mx-auto w-120">
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
          isDisabled={isBusy}
          isLoading={isLoading}
          query={query}
          setQuery={onInput}
          onClear={onClear}
        />
        {shouldShowList && (
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup
              heading={
                filteredSuggestions.length > 0 && t("search.suggestions")
              }
            >
              {filteredSuggestions.map((suggestion) => (
                <CardSuggestionItem
                  key={suggestion.riftboundId}
                  {...suggestion}
                  disabled={isBusy}
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

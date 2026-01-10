import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandList,
} from "@/components/ui/command";
import { CardDetailsDto } from "@/features/card-search";
import { useQuery } from "@tanstack/react-query";
import { FC, useEffect, useMemo, useState } from "react";
import { fetchCardSuggestions } from "../services/fetchCardSuggestions";
import { CardSuggestionInput } from "./card-suggestion-input";
import { CardSuggestionItem } from "./card-suggestion-item";
import { CardSuggestionWarning, Warnings } from "./card-suggestion-warning";
import { queryClient } from "@/app/providers/query-provider";

type Props = {
  suggestions?: CardDetailsDto[];
};

export const CardSuggestions: FC<Props> = ({ suggestions = [] }) => {
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

  const validateQuery = (query: string) => {
    if (query.length < 3 && query !== "") {
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

    if (!validQuery) return;
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
          isDisabled={isBusy}
          isLoading={isLoading}
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

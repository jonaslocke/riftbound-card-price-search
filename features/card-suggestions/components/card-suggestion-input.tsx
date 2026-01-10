import { Button } from "@/components/ui/button";
import { CommandInput } from "@/components/ui/command";
import { CircleX, LoaderCircle } from "lucide-react";
import { FC } from "react";

type Props = {
  query: string;
  setQuery: (query: string) => void;
  isDisabled: boolean;
  isLoading: boolean;
  onClear?: () => void;
};

export const CardSuggestionInput: FC<Props> = ({
  isDisabled,
  isLoading,
  query,
  setQuery,
  onClear,
}) => {
  const shouldShowClear = !!onClear && !isDisabled && !isLoading && query;

  return (
    <CommandInput asChild>
      <div className="flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="flex flex-1 bg-transparent disabled:opacity-50 py-3 rounded-md outline-hidden w-full h-10 placeholder:text-muted-foreground text-sm disabled:cursor-not-allowed"
          name="search"
          disabled={isDisabled}
        />
        {shouldShowClear && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="hover:bg-black/10"
            onClick={() => onClear()}
          >
            <CircleX className="size-4.5 text-black/60" />
          </Button>
        )}
        {isLoading && <LoaderCircle className="size-4.5 animate-spin" />}
      </div>
    </CommandInput>
  );
};

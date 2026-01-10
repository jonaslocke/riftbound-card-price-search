import { useI18nHelpers } from "@/app/i18n/HelpersProvider";
import { FC, PropsWithChildren } from "react";

export type Warnings = "min-char" | "generic-error" | null;

type Props = {
  warning: Warnings;
};

const WarningUi: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="bg-white/90 -mb-2 px-3 pt-2 pb-4 rounded-t-lg text-destructive/80 text-xs">
      {children}
    </div>
  );
};

export const CardSuggestionWarning: FC<Props> = ({ warning }) => {
  const { t } = useI18nHelpers();

  if (!warning) {
    return <div className="-mb-2 h-10" />;
  }

  switch (warning) {
    case "min-char":
      return (
        <WarningUi>
          <div>{t("search.min_chars")}</div>
        </WarningUi>
      );
    case "generic-error":
      return (
        <WarningUi>
          <div>Error on search</div>
        </WarningUi>
      );
  }

  return null;
};

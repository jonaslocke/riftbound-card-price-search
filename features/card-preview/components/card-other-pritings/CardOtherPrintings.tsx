"use client";

import { useI18nHelpers } from "@/app/i18n/HelpersProvider";
import { CirclePlus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCardDetails } from "../../state/context";
import OtherPrintTile from "./OtherPrintTile";

export default function CardOtherPrintings() {
  const { t } = useI18nHelpers();
  const card = useCardDetails();
  const { otherPrintings } = card;
  const pathname = usePathname();
  const pathParts = pathname.split("/");
  const locale = pathParts[1] || "";
  const currentCard = pathParts[pathParts.length - 1] || "";
  const cardBasePath = locale ? `/${locale}/cards` : "/cards";

  const baseHref = card.normalizedCardNumber
    ? `${cardBasePath}/${card.normalizedCardNumber}`
    : "#";

  if (otherPrintings.length < 1) {
    return null;
  }

  console.log({ otherPrintings });

  return (
    <div className="flex flex-col order-2 sm:order-1">
      <div className="flex justify-center items-center gap-0.5 bg-primary py-0.5 rounded-t-lg text-white/80 tiny-font">
        <CirclePlus className="size-3" />
        <span className="leading-3">{t("card.other_printings")}</span>
      </div>
      <div className="flex flex-row sm:flex-col flex-wrap sm:flex-nowrap justify-center sm:justify-start gap-2 p-2 border-2 border-primary border-t-0 rounded-b-lg max-h-[400] overflow-y-auto scrollbar-compact">
        <OtherPrintTile
          href={baseHref}
          name={card.name}
          image_url={card.imageUrl}
          public_code={card.cardNumber}
          isSelected={currentCard === card.normalizedCardNumber}
          isAlteredArt={false}
          isSignature={false}
          isOverNumbered={false}
        />
        {otherPrintings.map(
          ({ riftbound_id, name, media, public_code, metadata }) => (
            <OtherPrintTile
              key={riftbound_id}
              href={buildVariantHref(cardBasePath, riftbound_id)}
              name={name}
              image_url={media?.image_url}
              public_code={public_code}
              isAlteredArt={metadata?.alternate_art}
              isOverNumbered={metadata?.overnumbered}
              isSignature={metadata?.signature}
              isSelected={currentCard === buildVariantSlug(riftbound_id)}
            />
          )
        )}
      </div>
    </div>
  );
}

function buildVariantSlug(riftboundId?: string | null) {
  if (!riftboundId) return "";
  return riftboundId.toLowerCase();
}

function buildVariantHref(basePath: string, riftboundId?: string | null) {
  const slug = buildVariantSlug(riftboundId);
  return slug ? `${basePath}/${slug}` : "#";
}

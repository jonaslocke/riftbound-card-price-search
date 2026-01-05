import CardSummary from "@/app/components/CardSummary";
import CardDetailAnalytics from "@/app/components/analytics/CardDetailAnalytics";
import CardListing from "@/app/components/card-listing/CardListing";
import { defaultLocale, isLocaleSegment } from "@/app/i18n/settings";
import { authOptions } from "@/features/authentication/auth";
import CardPreview from "@/features/card-preview";
import { toCardDetailsDto } from "@/lib/card-details-dto";
import { createCardMetadata } from "@/lib/metadata/create-card-metadata";
import { parseSlug } from "@/lib/parseSlug";
import { fetchCard } from "@/services/fetchCard";
import { fetchCardPrices } from "@/services/fetchCardPrices";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

type CardPageParams = { locale?: string; slug?: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug?: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  const riftboundId = slug ?? "";

  const setId = riftboundId.slice(0, 3).toUpperCase();

  const card = await fetchCard(setId, 0, riftboundId);

  if (!card) {
    return {
      title: `Card not found | Hextech Index`,
      description: "Card not found.",
    };
  }

  return createCardMetadata({
    card,
    locale,
  });
}

export default async function CardPage({
  params,
}: {
  params: Promise<CardPageParams> | CardPageParams;
}) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug;
  const localeParam = resolvedParams?.locale;
  const locale = isLocaleSegment(localeParam) ? localeParam : defaultLocale;
  const { setId, collector, riftboundId } = parseSlug(slug);
  if (!setId || (!collector && !riftboundId)) {
    notFound();
  }

  const card = await fetchCard(setId, collector, riftboundId);
  if (!card) notFound();
  const details = toCardDetailsDto(card);
  const analyticsCardId = card.riftbound_id ?? card.id;
  const session = await getServerSession(authOptions);
  const prices = session
    ? await fetchCardPrices(setId, collector, riftboundId)
    : null;

  return (
    <main className="flex flex-col flex-1 gap-6 mx-auto mt-17 sm:mt-19 border-transparent border-t w-full max-w-4xl min-h-screen container-padding">
      <CardDetailAnalytics
        cardId={analyticsCardId}
        cardName={card.name}
        authState={session ? "authenticated" : "anonymous"}
        prices={prices}
      />
      <CardSummary details={details} />
      <CardPreview card={card} className="mt-6 sm:mt-12">
        <CardPreview.OtherPrintings />
        <CardPreview.Image />
        <CardPreview.Details>
          <CardPreview.Details.Title />
          <CardPreview.Details.SuperTypes />
          <CardPreview.Details.Types />
          <CardPreview.Details.Description />
          <CardPreview.Details.SetAndNumber />
          <CardPreview.Details.Illustrator />
          <CardPreview.Details.Might />
        </CardPreview.Details>
      </CardPreview>
      <CardListing
        prices={prices}
        locale={locale}
        cardId={analyticsCardId}
        cardName={card.name}
      />
    </main>
  );
}

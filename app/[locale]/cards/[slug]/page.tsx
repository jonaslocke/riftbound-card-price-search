import CardSummary from "@/app/components/CardSummary";
import CardDetailAnalytics from "@/app/components/analytics/CardDetailAnalytics";
import CardDetails from "@/app/components/card-details";
import CardListing from "@/app/components/card-listing";
import CardListingAuthPrompt from "@/app/components/card-listing/CardListingAuthPrompt";
import { defaultLocale, isLocaleSegment } from "@/app/i18n/settings";
import { authOptions } from "@/lib/auth";
import { toCardDetailsDto } from "@/lib/card-details-dto";
import { parseSlug } from "@/lib/parseSlug";
import { fetchCard } from "@/services/fetchCard";
import { fetchCardPrices } from "@/services/fetchCardPrices";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

type CardPageParams = { locale?: string; slug?: string };

export default async function CardPage({
  params,
}: {
  params: Promise<CardPageParams> | CardPageParams;
}) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug;
  const localeParam = resolvedParams?.locale;
  const locale = isLocaleSegment(localeParam) ? localeParam : defaultLocale;
  const { setId, collector } = parseSlug(slug);
  if (!setId || !collector) {
    notFound();
  }

  const card = await fetchCard(setId, collector);
  if (!card) notFound();
  const details = toCardDetailsDto(card);
  const analyticsCardId = card.riftbound_id ?? card.id;
  const session = await getServerSession(authOptions);
  const prices = session ? await fetchCardPrices(setId, collector) : null;
  const signInUrl = `/${locale}/auth/signin?callbackUrl=${encodeURIComponent(
    `/${locale}/cards/${slug}`
  )}`;

  return (
    <main className="flex flex-col mx-auto mt-[clamp(24px,6vw,56px)] mb-[clamp(24px,8vw,64px)] px-[clamp(16px,4vw,32px)] w-full max-w-2xl">
      <CardDetailAnalytics
        cardId={analyticsCardId}
        cardName={card.name}
        authState={session ? "authenticated" : "anonymous"}
        prices={prices}
      />
      <CardSummary details={details} />
      <CardDetails card={card}>
        <CardDetails.Image />
        <CardDetails.Panel>
          <CardDetails.Title />
          <CardDetails.MainInfo />
          <CardDetails.Types />
          <CardDetails.Description />
          <CardDetails.NumberSet />
          <CardDetails.Illustrator />
          <CardDetails.Might />
        </CardDetails.Panel>
      </CardDetails>
      {session ? (
        <CardListing
          prices={prices}
          locale={locale}
          cardId={analyticsCardId}
          cardName={card.name}
        />
      ) : (
        <CardListingAuthPrompt locale={locale} signInUrl={signInUrl} />
      )}
    </main>
  );
}

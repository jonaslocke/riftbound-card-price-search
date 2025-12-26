import CardSummary from "@/app/components/CardSummary";
import CardDetails from "@/app/components/card-details";
import CardListing from "@/app/components/card-listing";
import { toCardDetailsDto } from "@/lib/card-details-dto";
import { parseSlug } from "@/lib/parseSlug";
import { fetchCard } from "@/services/fetchCard";
import { fetchCardPrices } from "@/services/fetchCardPrices";
import { notFound } from "next/navigation";

type CardPageParams = { slug?: string };

export default async function CardPage({
  params,
}: {
  params: Promise<CardPageParams> | CardPageParams;
}) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug;
  const { setId, collector } = parseSlug(slug);
  if (!setId || !collector) {
    notFound();
  }

  const card = await fetchCard(setId, collector);
  if (!card) notFound();
  const details = toCardDetailsDto(card);
  const prices = await fetchCardPrices(setId, collector);

  return (
    <main className="flex flex-col w-full max-w-2xl">
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
      <CardListing prices={prices} />
    </main>
  );
}

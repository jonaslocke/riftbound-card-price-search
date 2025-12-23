import CardDetails from "@/app/components/card-details";
import CardListing from "@/app/components/card-listing";
import CardDescriptionTestGrid from "@/app/components/CardDescriptionTestGrid";
import CardTokenCreationTestGrid from "@/app/components/CardTokenCreationTestGrid";
import { parseSlug } from "@/lib/parseSlug";
import { fetchCard } from "@/services/fetchCard";
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

  return (
    <main>
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
      <div className="h-12 md:h-10" aria-hidden="true" />
      <CardListing />
    </main>
  );
}

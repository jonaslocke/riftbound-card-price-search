import CardDetails from "@/app/components/card-details";
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
    <>
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
      <div className="h-4 md:h-2" aria-hidden="true" />
    </>
  );
}

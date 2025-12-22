import CardDetails from "@/app/components/CardDetails";
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

  return <CardDetails {...card} />;
}

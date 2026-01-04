import { createCardMetadata } from "@/lib/metadata/create-card-metadata";
import { fetchCard } from "@/services/fetchCard";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug?: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  // const riftboundId = slug ?? "";
  const riftboundId = "ogn-164-298";

  const setId = riftboundId.slice(0, 3);

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

export default async function ShareTest() {
  return <h1 className="mt-36 text-white">share test</h1>;
}

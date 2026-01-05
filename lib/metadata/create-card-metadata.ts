import { Card } from "@/app/types/card.schemas";
import type { Metadata } from "next";

type CreateCardMetadataParams = {
  card: Card;
  locale: string;
};

const SITE_NAME = "Hextech Index";
const SITE_URL = "https://hextechindex.com";

function buildTitle(card: Card): string {
  return card.public_code ? `${card.name} - ${card.public_code}` : card.name;
}

function buildDescription(card: Card): string {
  return `Price and availability information for ${card.name}.`;
}

function buildImageAlt(card: Card): string {
  return card.public_code ? `${card.name} - ${card.public_code}` : card.name;
}

export function createCardMetadata({
  card,
  locale,
}: CreateCardMetadataParams): Metadata {
  const riftboundId = card.riftbound_id!;

  const title = buildTitle(card);
  const description = buildDescription(card);

  const canonicalUrl = `${SITE_URL}/${locale}/cards/${riftboundId}`;
  const ogImageUrl = `${SITE_URL}/api/images/cards/${riftboundId}.jpg`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: ogImageUrl,
          secureUrl: ogImageUrl,
          width: 1200,
          height: 630,
          alt: buildImageAlt(card),
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

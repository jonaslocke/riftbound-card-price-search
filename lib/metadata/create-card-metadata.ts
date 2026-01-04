import { Card } from "@/app/types/card";
import type { Metadata } from "next";

type CreateCardMetadataParams = {
  card: Card;
  locale: string;
};

const SITE_NAME = "Hextech Index";
const SITE_URL = "https://hextechindex.com";

function buildTitle(card: Card): string {
  const publicCode = card.public_code ? ` - ${card.public_code}` : "";
  return `${card.name}${publicCode} | ${SITE_NAME}`;
}

function buildDescription(card: Card): string {
  return `Price and availability information for ${card.name}.`;
}

export function createCardMetadata({
  card,
  locale,
}: CreateCardMetadataParams): Metadata {
  const riftboundId = card.riftbound_id!;

  const title = buildTitle(card);
  const description = buildDescription(card);

  const url = `${SITE_URL}/${locale}/cards/${riftboundId}`;

  const ogImageUrl = `${SITE_URL}/api/images/cards/${riftboundId}.jpg`;

  const imageAlt =
    card.media?.accessibility_text ||
    `${card.name}${card.public_code ? ` - ${card.public_code}` : ""}`;

  return {
    title,
    description,

    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url,
      images: [
        {
          url: ogImageUrl,
          secureUrl: ogImageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
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

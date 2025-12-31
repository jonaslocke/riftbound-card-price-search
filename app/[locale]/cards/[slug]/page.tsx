import CardSummary from "@/app/components/CardSummary";
import CardDetailAnalytics from "@/app/components/analytics/CardDetailAnalytics";
import CardListing from "@/app/components/card-listing";
import CardListingAuthPrompt from "@/app/components/card-listing/CardListingAuthPrompt";
import {
  defaultLocale,
  isLocaleSegment,
  toLanguageTag,
} from "@/app/i18n/settings";
import CardPreview from "@/features/card-preview";
import { authOptions } from "@/lib/auth";
import { toCardDetailsDto } from "@/lib/card-details-dto";
import { parseSlug } from "@/lib/parseSlug";
import { siteMetadata } from "@/lib/site-metadata";
import { fetchCard } from "@/services/fetchCard";
import { fetchCardPrices } from "@/services/fetchCardPrices";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

type CardPageParams = { locale?: string; slug?: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<CardPageParams> | CardPageParams;
}): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug;
  const localeParam = resolvedParams?.locale;
  const locale = isLocaleSegment(localeParam) ? localeParam : defaultLocale;
  const ogLocale = toLanguageTag(locale).replace("-", "_");
  const { setId, collector, riftboundId } = parseSlug(slug);
  if (!setId || !collector) return {};

  const card = await fetchCard(setId, collector, riftboundId);
  if (!card) return {};

  const setLabel = card.set?.set_id ?? setId;
  const collectorLabel =
    card.collector_number != null
      ? String(card.collector_number)
      : String(collector);
  const title = `${card.name} - ${setLabel}/${collectorLabel}`;
  const description =
    card.text?.plain ??
    `Compare prices and availability for ${card.name} on ${siteMetadata.name}.`;
  const rawImageUrl = card.media?.image_url ?? siteMetadata.ogImage;
  const imageUrl = rawImageUrl.startsWith("http")
    ? rawImageUrl
    : `${siteMetadata.url}${rawImageUrl}`;
  const imageWidth = 744;
  const imageHeight = 1039;
  const pagePath = `/${locale}/cards/${slug}`;
  const canonicalUrl = `${siteMetadata.url}${pagePath}`;

  return {
    metadataBase: new URL(siteMetadata.url),
    title,
    description,
    keywords: siteMetadata.keywords,
    authors: [{ name: "Jonas Antunes" }],
    creator: "Jonas Antunes",
    publisher: "Jonas Antunes",
    robots: {
      index: true,
      follow: true,
    },
    other: {
      "msapplication-TileColor": "#0A0F1C",
      googlebot:
        "index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1",
      "apple-mobile-web-app-capable": "yes",
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: siteMetadata.name,
    },
    formatDetection: {
      telephone: false,
      address: false,
      email: false,
    },
    manifest: "/manifest.json",
    icons: {
      icon: [
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      shortcut: ["/favicon.ico"],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      siteName: siteMetadata.name,
      title,
      description,
      url: canonicalUrl,
      locale: ogLocale,
      images: [
        {
          url: imageUrl,
          width: imageWidth,
          height: imageHeight,
          alt: `${card.name} card art`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@hextechindex",
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: imageWidth,
          height: imageHeight,
          alt: `${card.name} card art`,
        },
      ],
    },
  };
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
  const signInUrl = `/${locale}/auth/signin?callbackUrl=${encodeURIComponent(
    `/${locale}/cards/${slug}`
  )}`;

  return (
    <main className="flex flex-col flex-1 gap-6 mx-auto mt-32 sm:mt-19 border-transparent border-t w-full max-w-4xl min-h-screen container-padding">
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

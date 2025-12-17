import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Card } from "../../types/card";

export const dynamic = "force-dynamic";

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

  const imageUrl = card.media?.image_url;
  const isLandscape = card.orientation === "landscape";
  const frameClass = isLandscape
    ? "card-portrait__frame card-portrait__frame--landscape"
    : "card-portrait__frame card-portrait__frame--portrait";
  const setLabel = card.set?.label ?? card.set?.set_id ?? setId;
  const cardCode =
    card.public_code ??
    (card.collector_number != null ? `#${card.collector_number}` : "Unknown");
  const tags = [
    card.classification?.supertype,
    card.classification?.type,
    card.classification?.rarity,
    ...(card.classification?.domain ?? []),
  ].filter(Boolean) as string[];
  const attrs = card.attributes;
  const typeKey = card.classification?.type?.toLowerCase();
  const statsByType: Record<string, Array<{ label: string; value: number | null | undefined }>> = {
    unit: [
      { label: "Energy", value: attrs?.energy },
      { label: "Power", value: attrs?.power },
      { label: "Might", value: attrs?.might },
    ],
    spell: [
      { label: "Energy", value: attrs?.energy },
      { label: "Power", value: attrs?.power },
    ],
  };
  const stats = statsByType[typeKey ?? ""] ?? [];
  const typeLine =
    [card.classification?.supertype, card.classification?.type]
      .filter(Boolean)
      .join(" ") || "Unknown";
  const metaItems: Array<[string, string | number]> = [
    ["Set", setLabel],
    ["Public code", card.public_code ?? "Unknown"],
    ["Collector #", card.collector_number ?? "Unknown"],
    ["Riftbound ID", card.riftbound_id ?? "Unknown"],
    ["Type", typeLine],
    ["Domain", card.classification?.domain?.join(", ") || "Unknown"],
  ];
  const rulesText = card.text?.plain?.trim() || "No rules text available.";

  return (
    <main className="card-shell card-shell--detail">
      <section className="card-hero">
        <div className="card-portrait">
          <div className={frameClass}>
            {imageUrl ? (
              <img src={imageUrl} alt={card.name} />
            ) : (
              <div className="card-portrait__placeholder">
                <span className="card-portrait__sigil">
                  {card.name.slice(0, 1)}
                </span>
                <span className="card-portrait__name">{card.name}</span>
              </div>
            )}
          </div>
          <div className="card-portrait__caption">
            <span>{setLabel}</span>
            <span>{cardCode}</span>
          </div>
        </div>

        <div className="card-content">
          <header className="card-header">
            <h1 className="hero-title">{card.name}</h1>
          </header>

          {tags.length > 0 ? (
            <div className="card-tags">
              {tags.map((tag) => (
                <span className="card-tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {stats.length > 0 ? (
            <div className="card-stats">
              {stats.map((stat) => (
                <div className="card-stat" key={stat.label}>
                  <span className="card-stat__label">{stat.label}</span>
                  <span className="card-stat__value">{stat.value ?? "n/a"}</span>
                </div>
              ))}
            </div>
          ) : null}

          <p className="card-text">{rulesText}</p>

          <dl className="card-meta">
            {metaItems.map(([label, value]) => (
              <div className="card-meta__item" key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </main>
  );
}

function parseSlug(slug?: string) {
  if (typeof slug !== "string" || slug.trim() === "") {
    return { setId: null, collector: null };
  }
  const parts = slug.split("-");
  if (parts.length < 2) return { setId: null, collector: null };
  const setId = parts[0]?.toUpperCase();
  const collectorRaw = parts.slice(1).join("-");
  const collectorNum = Number(collectorRaw);
  const collector = Number.isFinite(collectorNum) ? collectorNum : collectorRaw;
  return { setId, collector };
}

async function fetchCard(setId: string, collector: number | string) {
  const headersList = await headers();
  const host = headersList.get("host");
  if (!host) return null;
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const number = encodeURIComponent(collector.toString());
  const url = `${protocol}://${host}/api/cards/detail?set=${encodeURIComponent(
    setId
  )}&number=${number}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const card = (await res.json()) as Card;
    return card ?? null;
  } catch {
    return null;
  }
}

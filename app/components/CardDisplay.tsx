import type { Card } from "../types/card";

type StatItem = {
  label: string;
  value: number | null | undefined;
};

const TYPE_ICON_SIZE = 24;
const DOMAIN_ICON_SIZE = 32;
const RARITY_ICON_SIZE = 128;

export default function CardDisplay({ card }: { card: Card }) {
  const typeKey = card.classification?.type?.toLowerCase();
  const isLandscape = card.orientation === "landscape";
  const imageUrl = card.media?.image_url;
  const typeLabel =
    [card.classification?.supertype, card.classification?.type]
      .filter(Boolean)
      .join(" ") || "Unknown";
  const rarityLabel = card.classification?.rarity ?? "Unknown";
  const setLabel =
    card.set?.label ?? card.set?.set_id ?? "Unknown";
  const cardNumber = card.public_code ?? "Unknown";

  const showStats = typeKey !== "battlefield" && typeKey !== "rune";
  const showMight = typeKey === "unit";
  const stats: StatItem[] = showStats
    ? [
        { label: "Energy", value: card.attributes?.energy },
        { label: "Power", value: card.attributes?.power },
        ...(showMight ? [{ label: "Might", value: card.attributes?.might }] : []),
      ]
    : [];

  const domainList =
    typeKey === "battlefield" ? [] : card.classification?.domain ?? [];
  const tags = card.tags ?? [];
  const rulesText =
    typeKey === "rune" ? "" : card.text?.plain?.trim() ?? "";

  return (
    <section className="flex flex-col gap-10 rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-2xl lg:flex-row">
      <div className="flex items-start justify-center">
        <div
          className={`rounded-3xl bg-slate-900 p-2 shadow-2xl ${
            isLandscape
              ? "w-full max-w-lg aspect-88/63"
              : "w-full max-w-xs aspect-63/88"
          }`}
        >
          {imageUrl ? (
            <img
              className="h-full w-full rounded-2xl object-cover"
              src={imageUrl}
              alt={card.name}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl bg-linear-to-br from-slate-800 to-slate-950 p-4 text-center font-serif text-slate-50">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/60 text-2xl">
                {card.name.slice(0, 1)}
              </span>
              <span className="text-base tracking-wide">{card.name}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-5 text-slate-900">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-serif text-2xl md:text-3xl">
            {card.name}
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge
            iconSrc={typeKey ? `/assets/types/${typeKey}-${TYPE_ICON_SIZE}.webp` : undefined}
            label={typeLabel}
          />
          <Badge
            iconSrc={
              card.classification?.rarity
                ? `/assets/rarities/${card.classification.rarity.toLowerCase()}-${RARITY_ICON_SIZE}.webp`
                : undefined
            }
            label={rarityLabel}
          />
          {domainList.map((domain) => (
            <Badge
              key={domain}
              iconSrc={`/assets/domains/${domain.toLowerCase()}-${DOMAIN_ICON_SIZE}.webp`}
              label={domain}
            />
          ))}
        </div>

        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                className="rounded-full bg-slate-200 px-3 py-1 text-xs uppercase tracking-widest text-slate-800"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        {stats.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-slate-50 md:grid-cols-3">
            {stats.map((stat) => (
              <div
                className="flex flex-col items-center gap-1 text-center"
                key={stat.label}
              >
                <span className="text-xs uppercase tracking-widest text-slate-200">
                  {stat.label}
                </span>
                <span className="text-xl font-bold">
                  {stat.value ?? "n/a"}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        {rulesText ? (
          <div className="flex flex-col gap-2">
            <h2 className="text-sm uppercase tracking-widest text-slate-600">
              Description
            </h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-900">
              {rulesText}
            </p>
          </div>
        ) : null}

        <div className="mt-auto border-t border-slate-200 pt-4">
          <h2 className="text-sm uppercase tracking-widest text-slate-600">
            Card Information
          </h2>
          <dl className="mt-2 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-widest text-slate-500">
                Artist
              </dt>
              <dd className="text-sm text-slate-900">
                {card.media?.artist ?? "Unknown"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-slate-500">
                Set
              </dt>
              <dd className="text-sm text-slate-900">{setLabel}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-slate-500">
                Card Number
              </dt>
              <dd className="text-sm text-slate-900">{cardNumber}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

function Badge({ iconSrc, label }: { iconSrc?: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-800">
      {iconSrc ? (
        <img className="h-5 w-5 object-contain" src={iconSrc} alt={label} />
      ) : null}
      {label}
    </span>
  );
}

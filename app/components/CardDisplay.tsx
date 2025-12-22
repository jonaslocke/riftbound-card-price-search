import type { Card } from "../types/card";
import { toCardDisplayData } from "@/lib/card-display-dto";

export default function CardDisplay({ card }: { card: Card }) {
  const display = toCardDisplayData(card);

  return (
    <section className="flex flex-col gap-10 rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-2xl lg:flex-row">
      <div className="flex items-start justify-center">
        <div
          className={`rounded-3xl bg-slate-900 p-2 shadow-2xl ${
            display.isLandscape
              ? "w-full max-w-lg aspect-88/63"
              : "w-full max-w-xs aspect-63/88"
          }`}
        >
          {display.imageUrl ? (
            <img
              className="h-full w-full rounded-2xl object-cover"
              src={display.imageUrl}
              alt={display.name}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl bg-linear-to-br from-slate-800 to-slate-950 p-4 text-center font-serif text-slate-50">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/60 text-2xl">
                {display.placeholderInitial}
              </span>
              <span className="text-base tracking-wide">{display.name}</span>
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
          {display.badges.map((badge) => (
            <Badge
              key={`${badge.label}-${badge.iconSrc ?? "no-icon"}`}
              iconSrc={badge.iconSrc}
              label={badge.label}
            />
          ))}
        </div>

        {display.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {display.tags.map((tag) => (
              <span
                className="rounded-full bg-slate-200 px-3 py-1 text-xs uppercase tracking-widest text-slate-800"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        {display.stats.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-slate-50 md:grid-cols-3">
            {display.stats.map((stat) => (
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

        {display.rulesText ? (
          <div className="flex flex-col gap-2">
            <h2 className="text-sm uppercase tracking-widest text-slate-600">
              Description
            </h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-900">
              {display.rulesText}
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
                {display.artistLabel}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-slate-500">
                Set
              </dt>
              <dd className="text-sm text-slate-900">{display.setLabel}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-slate-500">
                Card Number
              </dt>
              <dd className="text-sm text-slate-900">{display.cardNumber}</dd>
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

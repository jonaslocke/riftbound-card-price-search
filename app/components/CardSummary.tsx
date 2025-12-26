import { Badge } from "@/components/ui/badge";
import { toCardDetailsDto } from "@/lib/card-details-dto";
import { getCardInfoAssets } from "@/lib/getCardInfoAssets";
import { parseSlug } from "@/lib/parseSlug";
import { fetchCard } from "@/services/fetchCard";
import { notFound } from "next/navigation";
import { CardCostUi } from "./card-details/CardCost";
import { cn } from "@/lib/utils";

type CardPageParams = { slug?: string };

export default async function CardSummary({
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

  const details = toCardDetailsDto(card);
  const { name, imageUrl, energy, power, might, domains, type, rarity } =
    details;
  const { domainImg, rarityImg, typeImg } = getCardInfoAssets({
    domains,
    type,
    rarity,
    size: "sm",
  });
  const domainBadges = domains.map((domain) => ({
    domain,
    domainImg: getCardInfoAssets({
      domains: [domain],
      type,
      rarity,
      size: "sm",
    }).domainImg,
  }));
  const formatLabel = (value: string) =>
    value
      .split(" ")
      .map((word) => word[0]?.toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <nav
      className={cn(
        "w-full bg-slate-700/85 backdrop-blur-lg fixed z-30",
        // "translate-y-16"
      )}
    >
      <div className="mx-auto w-full max-w-2xl flex flex-col gap-3 md:flex-row md:items-center md:gap-6 py-2">
        {imageUrl && (
          <span
            className={cn(
              "flex h-12 items-center justify-center overflow-hidden rounded-md bg-(--panel-strong)",
              type === "battlefield" ? "aspect-88/63" : "aspect-63/88"
            )}
          >
            <img src={imageUrl} alt={name} loading="lazy" />
          </span>
        )}
        <div className="flex flex-col justify-center gap-1 flex-1">
          <h2 className="truncate font-semibold text-primary-foreground leading-4">
            {name}
          </h2>
          <div className="flex gap-0.5">
            {rarityImg && (
              <Badge variant="secondary">
                <img src={rarityImg} alt={`${rarity} image`} />
                <span className="capitalize">{rarity}</span>
              </Badge>
            )}
            {typeImg && (
              <Badge variant="secondary">
                <img src={typeImg} alt={`${type} image`} className="invert" />
                <span>{formatLabel(type)}</span>
              </Badge>
            )}
            {domainBadges.map(({ domain, domainImg: badgeImg }) => (
              <Badge key={domain} variant="secondary" className="select-none">
                {badgeImg ? <img src={badgeImg} alt="" /> : null}
                <span className="capitalize">{domain}</span>
              </Badge>
            ))}
          </div>
        </div>
        {energy && (
          <CardCostUi {...details} domainImg={domainImg} variant="light" />
        )}
      </div>
    </nav>
  );
}

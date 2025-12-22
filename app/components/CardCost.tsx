import type { CardDisplayData } from "@/lib/card-display-dto";

interface Props extends CardDisplayData {
  size: "sm" | "md" | "lg";
}

export function getDomainIconSrc(
  domains: CardDisplayData["domains"],
  size: Props["size"]
) {
  const domain = domains[0];
  if (!domain) {
    return undefined;
  }

  const sizeMap: Record<Props["size"], number> = {
    sm: 16,
    md: 32,
    lg: 64,
  };

  return `/assets/domains/${domain}-${sizeMap[size]}.webp`;
}

export default function CardCost({
  power,
  energy,
  domains,
  size = "sm",
}: Props) {
  const domainImg = getDomainIconSrc(domains, size);

  return (
    <div className="flex items-center h-6 gap-1">
      <div className="flex justify-center items-center size-5 rounded-full bg-black/10 text-xs">
        {energy}
      </div>
      {power && domainImg && (
        <div className="flex">
          {Array.from({ length: power }).map((_, index) => (
            <div
              key={index}
              className="flex justify-center items-center rounded-full bg-white/10"
            >
              <img src={domainImg} alt={`${domains[0]} power image`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

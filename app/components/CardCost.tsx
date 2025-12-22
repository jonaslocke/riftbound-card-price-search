import type { CardDisplayData } from "@/lib/card-display-dto";
import { getCardInfoAssets } from "@/lib/getCardInfoAssets";

interface Props extends CardDisplayData {
  size: "sm" | "md" | "lg";
}

export default function CardCost(props: Props) {
  const { power, energy, domains, size = "sm" } = props;
  const { domainImg } = getCardInfoAssets({ ...props, size });

  return (
    <div className="flex items-center h-6 gap-1">
      <div className="flex justify-center items-center size-5 rounded-full bg-black/10 text-xs">
        {energy}
      </div>
      {power && domainImg && (
        <div className="flex ml-1">
          {Array.from({ length: power }).map((_, index) => (
            <div
              key={index}
              className="flex justify-center items-center rounded-full bg-white/10 border border-white/10 -ml-1.5"
            >
              <img src={domainImg} alt={`${domains[0]} power image`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

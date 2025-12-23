import icon from "@/assets/icons/might-24.webp";
import { CardDisplayData } from "@/lib/card-display-dto";
import { cn } from "@/lib/utils";

export default function UnitCardMight({ might, rarity }: CardDisplayData) {
  if (!might) return null;

  console.log(rarity);

  return (
    <div
      className={cn(
        "absolute p-0! select-none right-0 bottom-0",
        "translate-y-[30%] translate-x-[30%]"
      )}
      style={{
        filter: "drop-shadow(0 18px 30px rgba(0, 0, 0, 0.35))",
      }}
    >
      <div
        className={cn(
          "flex items-center gap-2 py-0.5 px-1.5 rounded border border-black/50",
          rarity === "Common"
            ? "bg-common"
            : rarity === "Uncommon"
            ? "bg-uncommon"
            : "bg-rare"
        )}
      >
        <div className="size-5">
          <img src={icon.src} alt="might symbol" className="invert" />
        </div>
        <div className="text-lg">{might}</div>
      </div>
    </div>
  );
}

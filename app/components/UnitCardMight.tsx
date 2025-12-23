import src from "@/assets/icons/might-24.webp";
import { CardDisplayData } from "@/lib/card-display-dto";
import { cn } from "@/lib/utils";

export default function UnitCardMight({ might }: CardDisplayData) {
  if (!might) return null;

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
      <div className="flex items-center gap-2 bg-might py-1 px-2 rounded border border-black/50">
        <div className="">
          <img src={src.src} alt="might symbol" className="invert" />
        </div>
        <div className="text-xl">{might}</div>
      </div>
    </div>
  );
}

import src from "@/assets/icons/might-24.webp";
import { CardDisplayData } from "@/lib/card-display-dto";
export default function UnitCardMight({ might }: CardDisplayData) {
  if (!might) return null;

  return (
    <div className="absolute  p-0! right-0 bottom-0 translate-y-[50%] translate-x-[20%] select-none">
      <div className="flex items-center gap-2 bg-might py-1 px-2 rounded">
        <div className="">
          <img src={src.src} alt="might symbol" className="invert" />
        </div>
        <div className="text-xl">{might}</div>
      </div>
    </div>
  );
}

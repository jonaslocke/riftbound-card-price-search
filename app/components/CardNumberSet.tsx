import { CardDisplayData } from "@/lib/card-display-dto";

export default function CardNumberSet({
  setLabel,
  cardNumber,
}: CardDisplayData) {
  return (
    <div className="text-xs flex justify-end font-medium text-black/70">
      {setLabel} | {cardNumber}
    </div>
  );
}

import { CardDisplayData } from "@/lib/card-display-dto";
import { transpileCardDescription } from "@/lib/transpileCardDescription";

export default function CardDescription({ descriptionPlain }: CardDisplayData) {
  return (
    <p className="flex-1 text-sm leading-6">
      {transpileCardDescription(descriptionPlain)}
    </p>
  );
}

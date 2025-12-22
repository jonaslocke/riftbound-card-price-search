import { CardDisplayData } from "@/lib/card-display-dto";
import { transpileCardDescription } from "@/lib/transpileCardDescription";

export default function CardDescription({ descriptionPlain }: CardDisplayData) {
  return <p>{transpileCardDescription(descriptionPlain)}</p>;
}

import { CardDisplayData } from "@/lib/card-display-dto";

export default function CardDescription({ descriptionPlain }: CardDisplayData) {
  return <p>{descriptionPlain}</p>;
}

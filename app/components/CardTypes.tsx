import { Badge } from "@/components/ui/badge";
import { CardDisplayData } from "@/lib/card-display-dto";

export default function CardTypes({ tags }: CardDisplayData) {
  return (
    <div className="flex gap-0.5">
      {tags.map((tag, index) => (
        <Badge key={index} variant="secondary">
          {tag}
        </Badge>
      ))}
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { CardDisplayData } from "@/lib/card-display-dto";

export default function CardTypes({ tags, type }: CardDisplayData) {
  return (
    <div className="flex gap-1">
      <Badge variant="secondary">{type}</Badge>
      {tags.map((tag, index) => (
        <Badge key={index} variant="secondary">
          {tag}
        </Badge>
      ))}
    </div>
  );
}

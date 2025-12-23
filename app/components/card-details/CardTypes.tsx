"use client";

import { Badge } from "@/components/ui/badge";
import { useCardDetails } from "./context";

export default function CardTypes() {
  const { tags } = useCardDetails();

  if (tags.length === 0) {
    return null;
  }

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

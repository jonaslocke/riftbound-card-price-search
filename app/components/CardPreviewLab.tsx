"use client";

import { useState } from "react";
import type { Card } from "@/app/types/card";
import CardPreview from "@/features/card-preview";
import { cardPreviewGroups } from "@/lib/cardPreviewGroups";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CardContent,
  CardHeader,
  Card as CardUi,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  cardsByCode: Record<string, Card>;
};

export default function CardPreviewLab({ cardsByCode }: Props) {
  const [selectedOption, setSelectedOption] = useState(
    cardPreviewGroups[0]?.option ?? ""
  );

  const selectedGroup =
    cardPreviewGroups.find((group) => group.option === selectedOption) ??
    cardPreviewGroups[0];

  return (
    <CardUi className="bg-slate-900/85 backdrop-blur-lg mt-4 border-slate-400/20 text-white">
      <CardHeader className="">
        <CardTitle className="flex justify-between items-center">
          <h2>Test card descriptions</h2>
          <Select value={selectedOption} onValueChange={setSelectedOption}>
            <SelectTrigger className="min-w-55">
              <SelectValue placeholder="Select group" />
            </SelectTrigger>
            <SelectContent>
              {cardPreviewGroups.map((group) => (
                <SelectItem key={group.option} value={group.option}>
                  {group.option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-wrap *:w-1/3">
        {selectedGroup?.cards.map((code) => {
          const card = cardsByCode[code];
          if (!card) {
            return (
              <div key={code} className="text-muted-foreground text-sm">
                Missing card data for {code}.
              </div>
            );
          }
          return (
            <div className="px-4 py-3 *:min-h-[348]">
              <CardPreview card={card} key={code}>
                <CardPreview.Details>
                  <CardPreview.Details.Title />
                  <CardPreview.Details.SuperTypes />
                  <CardPreview.Details.Types />
                  <CardPreview.Details.Description />
                  <CardPreview.Details.SetAndNumber />
                  <CardPreview.Details.Illustrator />
                  <CardPreview.Details.Might />
                </CardPreview.Details>
              </CardPreview>
            </div>
          );
        })}
      </CardContent>
    </CardUi>
  );
}

import CardPreviewLab from "@/app/components/CardPreviewLab";
import { Card } from "@/app/types/card.schemas";
import { authOptions } from "@/features/authentication/auth";
import { requireRole } from "@/features/authentication/authorization";
import { cardPreviewGroups } from "@/lib/cardPreviewGroups";
import { fetchCard } from "@/services/fetchCard";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

type CardLookup = {
  setId: string;
  collector: number;
};

function parseCardCode(code: string): CardLookup | null {
  const [setIdRaw, collectorRaw] = code.split("-");
  if (!setIdRaw || !collectorRaw) {
    return null;
  }
  const collector = Number(collectorRaw);
  if (!Number.isFinite(collector)) {
    return null;
  }
  return { setId: setIdRaw.toUpperCase(), collector };
}

export default async function CardPreviewsPage() {
  const session = await getServerSession(authOptions);
  try {
    requireRole(session, ["god"]);
  } catch {
    notFound();
  }

  const codes = Array.from(
    new Set(cardPreviewGroups.flatMap((group) => group.cards))
  );
  const entries = await Promise.all(
    codes.map(async (code) => {
      const parsed = parseCardCode(code);
      if (!parsed) {
        return [code, null] as const;
      }
      const card = await fetchCard(parsed.setId, parsed.collector);
      return [code, card] as const;
    })
  );

  const cardsByCode: Record<string, Card> = {};
  entries.forEach(([code, card]) => {
    if (card) {
      cardsByCode[code] = card;
    }
  });

  return (
    <main className="flex flex-col flex-1 gap-6 mx-auto mt-19 border-t border-t-transparent w-full container-padding">
      <CardPreviewLab cardsByCode={cardsByCode} />
    </main>
  );
}

import type { ReactNode } from "react";
import CardSummary from "@/app/components/CardSummary";

type Props = {
  children: ReactNode;
  params: { slug?: string };
};

export default function CardSlugLayout({ children, params }: Props) {
  return (
    <>
      <CardSummary params={params} />
      {children}
    </>
  );
}

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function CardSlugLayout({ children }: Props) {
  return <>{children}</>;
}

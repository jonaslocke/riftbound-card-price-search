"use client";

import type { CardDetailsDto } from "@/app/types/card";
import { Badge } from "@/components/ui/badge";
import { getCardInfoAssets } from "@/lib/getCardInfoAssets";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { CardCostUi } from "./card-details/CardCost";

const DETAILS_ROOT_ID = "card-details-root";

type Props = {
  details: CardDetailsDto;
};

export default function CardSummary({ details }: Props) {
  const [detailsVisible, setDetailsVisible] = useState(true);

  useEffect(() => {
    const element = document.getElementById(DETAILS_ROOT_ID);
    if (!element) {
      setDetailsVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setDetailsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const showSummary = !detailsVisible;
  const { name, imageUrl, energy, domains, type, rarity } = details;
  const { domainImg, rarityImg, typeImg } = getCardInfoAssets({
    domains,
    type,
    rarity,
    size: "sm",
  });
  const domainBadges = useMemo(
    () =>
      domains.map((domain) => ({
        domain,
        domainImg: getCardInfoAssets({
          domains: [domain],
          type,
          rarity,
          size: "sm",
        }).domainImg,
      })),
    [domains, rarity, type]
  );
  const formatLabel = (value: string) =>
    value
      .split(" ")
      .map((word) => word[0]?.toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <motion.nav
      aria-hidden={!showSummary}
      initial={false}
      animate={showSummary ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: -12, transition: { duration: 0.2 } },
        visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
      }}
      className={cn(
        "top-31 sm:top-16 z-30 fixed inset-x-0 flex flex-col gap-3 bg-slate-700/85 backdrop-blur-lg px-4 md:px-6 py-3 border-slate-400/20 border-b",
        showSummary ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      <div className="flex items-center gap-3 mx-auto py-2 w-full max-w-2xl">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={"brand.name"}
            width={744}
            height={1039}
            className={cn(
              "w-10 sm:w-12",
              type === "battlefield" ? "aspect-88/63" : "aspect-63/88"
            )}
          />
        )}
        <div className="flex flex-col flex-1 justify-center gap-1">
          <h2 className="font-semibold text-white/80">{name}</h2>
          <div className="flex flex-wrap gap-1">
            {rarityImg && (
              <Badge variant="secondary">
                <img src={rarityImg} alt={`${rarity} image`} />
                <span className="capitalize">{rarity}</span>
              </Badge>
            )}
            {typeImg && (
              <Badge variant="secondary">
                <img src={typeImg} alt={`${type} image`} className="invert" />
                <span>{formatLabel(type)}</span>
              </Badge>
            )}
            {domainBadges.map(({ domain, domainImg: badgeImg }) => (
              <Badge key={domain} variant="secondary" className="select-none">
                {badgeImg ? <img src={badgeImg} alt="" /> : null}
                <span className="capitalize">{domain}</span>
              </Badge>
            ))}
          </div>
        </div>
        {energy && (
          <CardCostUi {...details} domainImg={domainImg} variant="light" />
        )}
      </div>
    </motion.nav>
  );
}

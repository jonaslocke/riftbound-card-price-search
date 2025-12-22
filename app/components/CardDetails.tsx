"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { toCardDisplayData } from "@/lib/card-display-dto";
import type { Card, CardDomain } from "../types/card";
import { cn } from "@/lib/utils";
import CardCost from "./CardCost";
import CardTitle from "./CardTitle";

type DomainBorderClass = `border-t-${CardDomain} border-b-${CardDomain}`;

const domainBorderColors: Record<CardDomain, DomainBorderClass> = {
  order: "border-t-order border-b-order",
  body: "border-t-body border-b-body",
  calm: "border-t-calm border-b-calm",
  chaos: "border-t-chaos border-b-chaos",
  fury: "border-t-fury border-b-fury",
  mind: "border-t-mind border-b-mind",
};

export default function CardDetails(card: Card) {
  const cardDetails = toCardDisplayData(card);
  const { imageUrl, name, domains } = cardDetails;
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const smoothTiltX = useSpring(tiltX, { stiffness: 180, damping: 18 });
  const smoothTiltY = useSpring(tiltY, { stiffness: 180, damping: 18 });

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const maxRotate = 6;
    tiltY.set((x - 0.5) * maxRotate * 2);
    tiltX.set((0.5 - y) * maxRotate * 2);
  };

  const handleMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <div className="flex">
      <div
        className="z-1 w-[320]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: "900px" }}
      >
        <motion.img
          src={imageUrl}
          alt={name}
          className="w-full"
          style={{
            rotateX: smoothTiltX,
            rotateY: smoothTiltY,
            transformStyle: "preserve-3d",
            filter: "drop-shadow(0 18px 30px rgba(0, 0, 0, 0.35))",
          }}
        />
      </div>
      <div
        className={cn(
          "bg-white/75 w-[356] h-[470] text-black -translate-x-5 translate-y-5",
          "border border-t-3 border-b-3 border-slate-400",
          "*:pl-8 *:py-2 *:pr-3 *:border-b *:border-b-black/10",
          domains[0] && domainBorderColors[domains[0]]
        )}
      >
        <CardTitle {...cardDetails} />
      </div>
    </div>
  );
}

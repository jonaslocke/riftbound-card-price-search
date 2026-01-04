"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useCardDetails } from "../state/context";
import { cn } from "@/lib/utils";
import { DETAILS_ROOT_ID } from "../contants";

export default function CardImage() {
  const { imageUrl, name, type } = useCardDetails();

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
    <div
      className={cn(
        "z-1 relative order-1 sm:order-2 w-80",
        type === "battlefield" ? "" : "h-[392] sm:h-[446]"
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "900px" }}
      id={DETAILS_ROOT_ID}
    >
      <div className="hidden sm:block w-80 h-[392] sm:h-[446]" />
      <motion.img
        src={imageUrl}
        alt={name}
        className="sm:-top-5 sm:left-5 sm:absolute w-full"
        style={{
          rotateX: smoothTiltX,
          rotateY: smoothTiltY,
          transformStyle: "preserve-3d",
          filter: "drop-shadow(0 18px 30px rgba(0, 0, 0, 0.35))",
        }}
        loading="lazy"
      />
    </div>
  );
}

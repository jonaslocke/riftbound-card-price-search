"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useCardDetails } from "./context";

export default function CardImage() {
  const { imageUrl, name } = useCardDetails();

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
      className="z-1 w-80"
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
  );
}

"use client";

import { useState, useEffect, useRef } from "react";

interface WindowSize {
  width: number;
  height: number;
  status: "RESIZING" | "STALE";
  breakpoint: "sm" | "md" | "lg" | "xl" | "2xl" | "base";
}

const useWindowSize = (): WindowSize => {
  const isClient = typeof window !== "undefined";
  const [size, setSize] = useState<Omit<WindowSize, "status">>({
    width: isClient ? window.innerWidth : 0,
    height: isClient ? window.innerHeight : 0,
    breakpoint: getBreakpoint(isClient ? window.innerWidth : 0),
  });
  const [status, setStatus] = useState<"RESIZING" | "STALE">("STALE");

  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const handleResize = () => {
      const nextWidth = window.innerWidth;
      const nextHeight = window.innerHeight;
      setSize({
        width: nextWidth,
        height: nextHeight,
        breakpoint: getBreakpoint(nextWidth),
      });
      setStatus("RESIZING");

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setStatus("STALE");
      }, 200);
    };

    window.addEventListener("resize", handleResize, {
      signal: controller.signal,
    });

    return () => {
      controller.abort();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    width: size.width,
    height: size.height,
    status,
    breakpoint: size.breakpoint,
  };
};

export default useWindowSize;

const getBreakpoint = (width: number): WindowSize["breakpoint"] => {
  if (width >= 1536) return "2xl";
  if (width >= 1280) return "xl";
  if (width >= 1024) return "lg";
  if (width >= 768) return "md";
  if (width >= 640) return "sm";
  return "base";
};

"use client";

import { useEffect, useState, useCallback } from "react";
import { Aurora } from "./aurora";
import { Beam } from "./beam";
import { Particles } from "./particles";
import { NotebookIcon } from "./notebook";
import { LoadingText } from "./loading-text";

interface PageLoaderProps {
  isLoading?: boolean;
}

export function PageLoader({ isLoading = true }: PageLoaderProps) {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [phase, setPhase] = useState<"enter" | "active" | "exit" | "done">("enter");

  // Fade-in on mount
  useEffect(() => {
    const timer = setTimeout(() => setPhase("active"), 100);
    return () => clearTimeout(timer);
  }, []);

  // Exit animation when loading completes
  useEffect(() => {
    if (!isLoading && phase === "active") {
      setPhase("exit");
      const timer = setTimeout(() => setPhase("done"), 800);
      return () => clearTimeout(timer);
    }
  }, [isLoading, phase]);

  // Mouse parallax (±8px)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = ((e.clientX / window.innerWidth) - 0.5) * 16;
    const y = ((e.clientY / window.innerHeight) - 0.5) * 16;
    setMouseOffset({ x, y });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-background
        transition-all duration-700 ease-out
        ${phase === "enter" ? "opacity-0" : ""}
        ${phase === "exit" ? "opacity-0 scale-105" : ""}
        ${phase === "active" ? "opacity-100" : ""}`}
    >
      <Aurora />
      <Beam />
      <Particles mouseOffset={mouseOffset} />

      <div
        className={`relative flex flex-col items-center gap-10 transition-all duration-700 ease-out
          ${phase === "enter" ? "opacity-0 translate-y-4" : ""}
          ${phase === "exit" ? "opacity-0 scale-110" : ""}
          ${phase === "active" ? "opacity-100 translate-y-0" : ""}`}
      >
        <NotebookIcon mouseOffset={mouseOffset} />
        <LoadingText />
      </div>
    </div>
  );
}
"use client";

import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "default" | "lg";
  showText?: boolean;
}

const sizeMap = {
  sm: { icon: "size-4", text: "text-base", pad: "p-1.5" },
  default: { icon: "size-5", text: "text-lg", pad: "p-2" },
  lg: { icon: "size-7", text: "text-2xl", pad: "p-2.5" },
};

export function Logo({
  className,
  size = "default",
  showText = true,
}: LogoProps) {
  const s = sizeMap[size];
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className={cn("rounded-lg bg-primary", s.pad)}>
        <BookOpen className={cn(s.icon, "text-primary-foreground")} />
      </div>
      {showText && (
        <span className={cn("font-bold tracking-tight", s.text)}>
          Chaibook<span className="text-primary">LM</span>
        </span>
      )}
    </div>
  );
}

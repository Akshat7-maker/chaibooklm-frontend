// components/shared/top-progress-bar.tsx
"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function TopProgressBar({
  active,
  className,
}: {
  active: boolean;
  className?: string;
}) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) {
      setVisible(true);
      setProgress(15); // jump-start so it feels instant, not stuck at 0

      const timer = setInterval(() => {
        setProgress((p) => {
          if (p >= 90) return p; // never auto-complete — wait for `active` to flip false
          const remaining = 90 - p;
          return p + remaining * 0.12; // ease out — fast start, slows near the end
        });
      }, 180);

      return () => clearInterval(timer);
    }

    // active just turned false — finish the bar, then fade out
    setProgress(100);
    const hideTimer = setTimeout(() => setVisible(false), 300);
    return () => clearTimeout(hideTimer);
  }, [active]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] h-[3px] bg-transparent",
        className
      )}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-full bg-primary shadow-[0_0_8px_var(--primary)]",
          "transition-[width,opacity] ease-out",
          progress >= 100 ? "duration-300 opacity-0" : "duration-200 opacity-100"
        )}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
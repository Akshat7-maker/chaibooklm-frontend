"use client";

import { BookOpen } from "lucide-react";

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-background">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl animate-pulse" />

        <div className="absolute top-0 left-0 h-1 w-full overflow-hidden">
          <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent animate-[beam_1.6s_linear_infinite]" />
        </div>

        {[...Array(20)].map((_, i) => (
          <span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-primary/40 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${5 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div className="relative flex flex-col items-center">
        <div className="relative">
          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-primary/30 blur-2xl animate-pulse" />

          {/* Icon */}
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-primary/20 bg-card shadow-2xl backdrop-blur">
            <BookOpen className="h-10 w-10 text-primary animate-bounce" />
          </div>
        </div>

        <h2 className="mt-8 text-lg font-semibold tracking-tight">
          Preparing your workspace
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Organizing notebooks and syncing everything...
        </p>

        {/* Loading dots */}
        <div className="mt-8 flex gap-2">
          <span className="h-2 w-2 rounded-full bg-primary animate-[dot_1.2s_infinite]" />
          <span className="h-2 w-2 rounded-full bg-primary animate-[dot_1.2s_.2s_infinite]" />
          <span className="h-2 w-2 rounded-full bg-primary animate-[dot_1.2s_.4s_infinite]" />
        </div>
      </div>
    </div>
  );
}
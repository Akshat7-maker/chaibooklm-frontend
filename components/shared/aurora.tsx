"use client";

export function Aurora() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Blob 1 - Large indigo */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]"
        style={{ animation: "auroraMove1 8s ease-in-out infinite" }}
      />
      {/* Blob 2 - Cyan offset */}
      <div
        className="absolute left-[55%] top-[45%] -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-cyan-500/15 blur-[100px]"
        style={{ animation: "auroraMove2 12s ease-in-out infinite" }}
      />
      {/* Blob 3 - Indigo offset */}
      <div
        className="absolute left-[42%] top-[55%] -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[100px]"
        style={{ animation: "auroraMove3 10s ease-in-out infinite" }}
      />
    </div>
  );
}

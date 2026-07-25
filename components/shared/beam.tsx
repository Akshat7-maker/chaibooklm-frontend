"use client";

export function Beam() {
  return (
    <div className="absolute top-0 left-0 h-1 w-full overflow-hidden z-10">
      <div
        className="h-full w-1/4 bg-gradient-to-r from-transparent via-primary/80 to-transparent"
        style={{ animation: "beam 2s linear infinite" }}
      />
    </div>
  );
}

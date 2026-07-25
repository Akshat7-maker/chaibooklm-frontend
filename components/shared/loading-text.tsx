"use client";

import { useEffect, useState } from "react";

const messages = [
  "Preparing your workspace\u2026",
  "Loading notebooks\u2026",
  "Synchronizing memories\u2026",
  "Building knowledge graph\u2026",
  "Almost there\u2026",
];

export function LoadingText() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % messages.length);
        setVisible(true);
      }, 400);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <p
        className="text-lg font-medium tracking-tight"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-6px)",
          transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
        }}
      >
        {messages[index]}
      </p>

      {/* Loading dots */}
      <div className="mt-6 flex gap-2">
        <span className="h-2 w-2 rounded-full bg-primary" style={{ animation: "dot 1.2s infinite" }} />
        <span className="h-2 w-2 rounded-full bg-primary" style={{ animation: "dot 1.2s 0.2s infinite" }} />
        <span className="h-2 w-2 rounded-full bg-primary" style={{ animation: "dot 1.2s 0.4s infinite" }} />
      </div>
    </div>
  );
}

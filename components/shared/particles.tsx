"use client";

import { useMemo } from "react";

interface ParticlesProps {
  mouseOffset: { x: number; y: number };
}

export function Particles({ mouseOffset }: ParticlesProps) {
  const particles = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 5 + Math.random() * 6,
      size: 1 + Math.random() * 2,
    }));
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{
        transform: `translate(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px)`,
        transition: "transform 0.3s ease-out",
      }}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-cyan-400/50"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size * 4}px`,
            height: `${p.size * 4}px`,
            animation: `float ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

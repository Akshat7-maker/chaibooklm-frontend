"use client";

import { useEffect, useState, useCallback } from "react";
import { BookOpen } from "lucide-react";

const escapingWords = [
  "React", "AI", "Memory", "Vector", "Search",
  "Notebook", "TypeScript", "LangGraph", "Knowledge", "Thinking",
];

interface EscapingWord {
  id: number;
  text: string;
  x: number;
  delay: number;
}

interface NotebookProps {
  mouseOffset: { x: number; y: number };
}

let wordIdCounter = 0;

export function NotebookIcon({ mouseOffset }: NotebookProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [words, setWords] = useState<EscapingWord[]>([]);

  const triggerFlip = useCallback(() => {
    setIsFlipping(true);

    // Spawn 3-4 escaping words
    const count = 3 + Math.floor(Math.random() * 2);
    const newWords: EscapingWord[] = Array.from({ length: count }, () => {
      const word = escapingWords[Math.floor(Math.random() * escapingWords.length)];
      return {
        id: wordIdCounter++,
        text: word,
        x: -40 + Math.random() * 80,
        delay: Math.random() * 0.5,
      };
    });
    setWords(newWords);

    // Reset after animation
    setTimeout(() => {
      setIsFlipping(false);
      setWords([]);
    }, 3000);
  }, []);

  useEffect(() => {
    const initialTimeout = setTimeout(triggerFlip, 2500);
    const interval = setInterval(triggerFlip, 6000);
    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, [triggerFlip]);

  return (
    <div
      className="relative"
      style={{
        transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px)`,
        transition: "transform 0.3s ease-out",
      }}
    >
      {/* Glow behind notebook */}
      <div
        className="absolute -inset-10 rounded-full bg-primary/25 blur-3xl"
        style={{ animation: "pulseGlow 4s ease-in-out infinite" }}
      />

      {/* Floating wrapper */}
      <div style={{ animation: "breathe 5s ease-in-out infinite" }}>
        {/* Notebook body */}
        <div
          className={`relative flex h-28 w-28 items-center justify-center rounded-3xl
            border border-primary/20 bg-card shadow-2xl shadow-primary/10 backdrop-blur-sm
            transition-transform duration-700 ${isFlipping ? "scale-[1.05]" : ""}`}
          style={{ perspective: "600px" }}
        >
          {/* Page flip layer */}
          <div
            className={`absolute inset-1 rounded-2xl bg-primary/5 border border-primary/10 origin-left
              transition-transform duration-700 ${isFlipping ? "[transform:rotateY(-25deg)]" : ""}`}
          />

          <BookOpen
            className={`relative h-12 w-12 text-primary transition-all duration-500
              ${isFlipping ? "scale-110 text-cyan-400" : ""}`}
          />
        </div>
      </div>

      {/* Escaping words */}
      {words.map((word) => (
        <span
          key={word.id}
          className="absolute left-1/2 top-0 pointer-events-none whitespace-nowrap text-xs font-mono font-medium text-primary/80"
          style={{
            animation: `particleRise 2.5s ease-out ${word.delay}s forwards`,
            transform: `translateX(${word.x}px)`,
            opacity: 0,
          }}
        >
          {word.text}
        </span>
      ))}
    </div>
  );
}

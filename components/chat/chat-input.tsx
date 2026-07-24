"use client";

import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmpty = input.trim().length === 0;

  return (
    <div className="sticky bottom-0 p-4 pt-2 bg-background/80 backdrop-blur-md border-t z-10 glass">
      <div className="relative max-w-4xl mx-auto flex items-end gap-2 bg-card border rounded-xl p-1 shadow-sm focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your sources..."
          className="min-h-[44px] max-h-[120px] resize-none border-0 focus-visible:ring-0 bg-transparent py-3 px-4 shadow-none scrollbar-thin"
          disabled={isLoading}
          rows={1}
        />
        <div className="pb-1 pr-1 shrink-0">
          <Button
            size="icon"
            onClick={handleSend}
            disabled={isEmpty || isLoading}
            className="w-10 h-10 rounded-lg transition-all"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <SendHorizontal className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
      <div className="text-center mt-2">
        <span className="text-[11px] text-muted-foreground">
          AI can make mistakes. Always verify with your sources.
        </span>
      </div>
    </div>
  );
}

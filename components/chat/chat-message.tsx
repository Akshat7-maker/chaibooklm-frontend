"use client";

import { cn } from "@/lib/utils";
import { User, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  // Simple paragraph splitting for basic markdown-like rendering
  const paragraphs = content.split('\n').filter(p => p.trim().length > 0);

  return (
    <div className={cn(
      "flex w-full animate-slide-up mb-6",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex max-w-[85%] gap-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        <Avatar className="w-8 h-8 shrink-0 mt-0.5 border shadow-sm">
          <AvatarFallback className={cn(
            isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          </AvatarFallback>
        </Avatar>
        
        <div className={cn(
          "flex flex-col space-y-2 px-4 py-3 shadow-sm",
          isUser 
            ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm" 
            : "bg-muted/50 border rounded-2xl rounded-tl-sm text-foreground"
        )}>
          {paragraphs.map((para, idx) => (
            <p key={idx} className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

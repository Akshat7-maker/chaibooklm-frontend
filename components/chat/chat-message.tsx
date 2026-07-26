// "use client";

// import { cn } from "@/lib/utils";
// import { User, Sparkles } from "lucide-react";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// interface ChatMessageProps {
//   role: "USER" | "ASSISTANT" | "SYSTEM";
//   content: string;
// }

// export function ChatMessage({ role, content }: ChatMessageProps) {
//   const isUser = role === "USER";

//   // Simple paragraph splitting for basic markdown-like rendering
//   const paragraphs = content.split('\n').filter(p => p.trim().length > 0);

//   return (
//     <div className={cn(
//       "flex w-full animate-slide-up mb-6",
//       isUser ? "justify-end" : "justify-start"
//     )}>
//       <div className={cn(
//         "flex max-w-[85%] gap-3",
//         isUser ? "flex-row-reverse" : "flex-row"
//       )}>
//         <Avatar className="w-8 h-8 shrink-0 mt-0.5 border shadow-sm">
//           <AvatarFallback className={cn(
//             isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
//           )}>
//             {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
//           </AvatarFallback>
//         </Avatar>
        
//         <div className={cn(
//           "flex flex-col space-y-2 px-4 py-3 shadow-sm",
//           isUser 
//             ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm" 
//             : "bg-muted/50 border rounded-2xl rounded-tl-sm text-foreground"
//         )}>
//           {paragraphs.map((para, idx) => (
//             <p key={idx} className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
//               {para}
//             </p>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { cn } from "@/lib/utils";
import { User, Sparkles, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Citation {
  marker: number;
  resourceId: string;
  sourceType: string;
  title: string;
  startTime: number | null;
  endTime: number | null;
  page: number | null;
}

interface ChatMessageProps {
  role: "USER" | "ASSISTANT" | "SYSTEM";
  content: string;
  citations?: Citation[] | null;
  onCitationClick?: (citation: Citation) => void;
}

export function ChatMessage({ role, content, citations, onCitationClick }: ChatMessageProps) {
  const isUser = role === "USER";
  const paragraphs = content.split("\n").filter((p) => p.trim().length > 0);

  const citationByMarker = new Map((citations ?? []).map((c) => [c.marker, c]));

  return (
    <div className={cn("flex w-full animate-slide-up mb-6", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex max-w-[85%] gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
        <Avatar className="w-8 h-8 shrink-0 mt-0.5 border shadow-sm">
          <AvatarFallback className={cn(isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
            {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          </AvatarFallback>
        </Avatar>

        <div
          className={cn(
            "flex flex-col space-y-2 px-4 py-3 shadow-sm",
            isUser
              ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
              : "bg-muted/50 border rounded-2xl rounded-tl-sm text-foreground",
          )}
        >
          {paragraphs.map((para, idx) => (
            <p key={idx} className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
              {renderWithCitationMarkers(para, citationByMarker, onCitationClick)}
            </p>
          ))}

          {citations && citations.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border/50 mt-1">
              {citations.map((citation) => (
                <CitationChip key={citation.marker} citation={citation} onClick={onCitationClick} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Splits text on [n] markers and renders each as a clickable superscript button
function renderWithCitationMarkers(
  text: string,
  citationByMarker: Map<number, Citation>,
  onCitationClick?: (citation: Citation) => void,
) {
  const parts = text.split(/(\[\d+\])/g);

  return parts.map((part, i) => {
    const match = part.match(/^\[(\d+)\]$/);
    if (!match) return <span key={i}>{part}</span>;

    const marker = parseInt(match[1], 10);
    const citation = citationByMarker.get(marker);
    if (!citation) return <span key={i}>{part}</span>;

    return (
      <button
        key={i}
        onClick={() => onCitationClick?.(citation)}
        className="inline-flex items-center justify-center w-4 h-4 mx-0.5 -translate-y-0.5 rounded text-[10px] font-medium bg-accent hover:bg-accent/70 text-accent-foreground align-super"
        title={citation.title}
      >
        {marker}
      </button>
    );
  });
}

function CitationChip({ citation, onClick }: { citation: Citation; onClick?: (c: Citation) => void }) {
  const label =
    citation.sourceType === "YOUTUBE" || citation.sourceType === "VTT"
      ? formatTimestamp(citation.startTime)
      : citation.sourceType === "PDF" && citation.page
        ? `p. ${citation.page}`
        : null;

  return (
    <button
      onClick={() => onClick?.(citation)}
      className="inline-flex items-center gap-1 rounded-full border bg-background/50 px-2 py-0.5 text-[11px] text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      <span className="font-medium">[{citation.marker}]</span>
      <span className="truncate max-w-[140px]">{citation.title}</span>
      {label && <span className="opacity-70">{label}</span>}
      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
    </button>
  );
}

function formatTimestamp(seconds: number | null) {
  if (seconds == null) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
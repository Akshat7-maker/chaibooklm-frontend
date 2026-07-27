// "use client";

// import { useState, useRef, useEffect } from "react";
// import { ChatMessage } from "./chat-message";
// import { ChatInput } from "./chat-input";
// import { EmptyState } from "@/components/shared/empty-state";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { MessageSquare } from "lucide-react";
// import { api } from "@/lib/api-client";
// import { useConversation } from "@/hooks/use-conversation";
// import { Skeleton } from "../ui/skeleton";
// import { useGetMessages } from "@/hooks/use-messages";
// import { useSendMessage } from "@/hooks/use-send-message";
// import { useStreamingAnswer } from "@/hooks/use-streaming-answer";

// interface Message {
//   id: string;
//   role: "user" | "assistant";
//   content: string;
// }

// interface ChatInterfaceProps {
//   notebookId: string;
// }

// export function ChatInterface({ notebookId }: ChatInterfaceProps) {
//   const {
//     data,
//     isLoading: convoLoading,
//     isError,
//   } = useConversation(notebookId);
//   const conversationId = data?.conversation?.id || "";

//   const {
//     data: m,
//     isLoading: messagesLoading,
//     isError: mE,
//   } = useGetMessages(conversationId);

//   const { mutateAsync: sendMessage, isPending } =
//     useSendMessage(conversationId);

//     const { streamingText, isStreaming, streamError } = useStreamingAnswer(conversationId);

//   const serverMessages = m?.messages || []

//   const displayMessages = isStreaming
//   ? [...serverMessages, { id: "streaming", role: "ASSISTANT" as const, content: streamingText }]
//   : serverMessages;

//   // const [messages, setMessages] = useState<Message[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const scrollAreaRef = useRef<HTMLDivElement>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [serverMessages]);

//   const handleSend = async (content: string) => {
//     try {
//       await sendMessage({ question: content });
//     } catch (error) {}
//   };

//   if (convoLoading) {
//     return (
//       <div className="flex flex-col h-full p-4 gap-3">
//         <Skeleton className="h-16 w-2/3" />
//         <Skeleton className="h-16 w-1/2 self-end" />
//       </div>
//     );
//   }

//   if (isError || !conversationId) {
//     return (
//       <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
//         Couldn't start a conversation for this notebook.
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-full bg-background relative overflow-hidden">
//       <div className="flex items-center px-6 py-4 border-b bg-background/95 backdrop-blur z-10 shrink-0">
//         <h2 className="text-lg font-semibold tracking-tight">Chat</h2>
//       </div>

//       <ScrollArea className="flex-1" ref={scrollAreaRef}>
//         <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 min-h-full flex flex-col">
//           {displayMessages.length === 0 ? (
//             <div className="flex-1 flex items-center justify-center my-12">
//               <EmptyState
//                 icon={<MessageSquare className="w-10 h-10" />}
//                 title="Start a conversation"
//                 description="Ask questions about your uploaded sources to get intelligent answers."
//                 className="max-w-md animate-fade-in"
//               />
//             </div>
//           ) : (
//             <div className="flex flex-col pb-6">
//               {displayMessages.map((msg) => (
//                 <ChatMessage
//                   key={msg.id}
//                   role={msg.role}
//                   content={msg.content}
//                 />
//               ))}
//               {isStreaming && streamingText === "" && (
//                 <><div>Loading..</div></>
// )}

//               {isLoading && (
//                 <div className="animate-pulse flex gap-2 items-center text-muted-foreground p-4 text-sm">
//                   <div
//                     className="w-2 h-2 bg-current rounded-full animate-bounce"
//                     style={{ animationDelay: "0ms" }}
//                   />
//                   <div
//                     className="w-2 h-2 bg-current rounded-full animate-bounce"
//                     style={{ animationDelay: "150ms" }}
//                   />
//                   <div
//                     className="w-2 h-2 bg-current rounded-full animate-bounce"
//                     style={{ animationDelay: "300ms" }}
//                   />
//                 </div>
//               )}
//               <div ref={messagesEndRef} className="h-4" />
//             </div>
//           )}
//         </div>
//       </ScrollArea>

//       <ChatInput onSend={handleSend} isLoading={isLoading} />
//     </div>
//   );
// }

"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { EmptyState } from "@/components/shared/empty-state";
import { MessageSquare } from "lucide-react";
import { useConversation } from "@/hooks/use-conversation";
import { Skeleton } from "../ui/skeleton";
import { useGetMessages } from "@/hooks/use-messages";
import { useSendMessage } from "@/hooks/use-send-message";
import { useStreamingAnswer } from "@/hooks/use-streaming-answer";
import { useResources } from "@/hooks/use-resources";
interface Citation {
  marker: number;
  resourceId: string;
  sourceType: string;
  title: string;
  startTime: number | null;
  endTime: number | null;
  page: number | null;
}
interface ChatInterfaceProps {
  notebookId: string;
}

const BOTTOM_THRESHOLD_PX = 80; // how close to the bottom counts as "already there"

export function ChatInterface({ notebookId }: ChatInterfaceProps) {
  const {
    data,
    isLoading: convoLoading,
    isError,
  } = useConversation(notebookId);
  const conversationId = data?.conversation?.id || "";
  const { data: resourcesData } = useResources(notebookId);
  const resources = resourcesData?.resources ?? [];

  const { data: m } = useGetMessages(conversationId);
  const { mutateAsync: sendMessage } = useSendMessage(conversationId);
  const { streamingText, isStreaming, streamError, streamStarted } =
    useStreamingAnswer(conversationId);

  const serverMessages = m?.messages || [];

  const displayMessages = isStreaming
    ? [
        ...serverMessages,
        {
          id: "streaming",
          role: "ASSISTANT" as const,
          content: streamingText,
          citations: null,
        },
      ]
    : serverMessages;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const checkIfNearBottom = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return true;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    return distanceFromBottom < BOTTOM_THRESHOLD_PX;
  }, []);

  const handleScroll = useCallback(() => {
    setIsNearBottom(checkIfNearBottom());
  }, [checkIfNearBottom]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Only auto-scroll when the user is already near the bottom —
  // if they've scrolled up to read something, leave them alone
  useEffect(() => {
    if (isNearBottom) scrollToBottom();
  }, [displayMessages.length, streamingText, isNearBottom]);

  const handleSend = async (content: string) => {
    setIsNearBottom(true); // sending a message should always jump to bottom
    try {
      await sendMessage({ question: content });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleCitationClick = (citation: Citation) => {
    const resource = resources.find((r) => r.id === citation.resourceId);
    if (!resource?.originalUrl) return;

    if (citation.sourceType === "YOUTUBE" && citation.startTime != null) {
      const url = new URL(resource.originalUrl);
      url.searchParams.set("t", `${Math.floor(citation.startTime)}s`);
      window.open(url.toString(), "_blank");
      return;
    }

    if (citation.sourceType === "PDF" && citation.page) {
      window.open(`${resource.originalUrl}#page=${citation.page}`, "_blank");
      return;
    }

    // WEBSITE, DOCX, TXT, VTT-without-a-source-link — just open the source
    window.open(resource.originalUrl, "_blank");
  };

  if (convoLoading) {
    return (
      <div className="flex flex-col h-full p-4 gap-3">
        <Skeleton className="h-16 w-2/3" />
        <Skeleton className="h-16 w-1/2 self-end" />
      </div>
    );
  }

  if (isError || !conversationId) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Couldn't start a conversation for this notebook.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      <div className="flex items-center px-6 py-4 border-b bg-background/95 backdrop-blur z-10 shrink-0">
        <h2 className="text-lg font-semibold tracking-tight">Chat</h2>
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
      >
        <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 min-h-full flex flex-col">
          {displayMessages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center my-12">
              <EmptyState
                icon={<MessageSquare className="w-10 h-10" />}
                title="Start a conversation"
                description="Ask questions about your uploaded sources to get intelligent answers."
                className="max-w-md animate-fade-in"
              />
            </div>
          ) : (
            <div className="flex flex-col pb-6">
              {displayMessages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  citations={msg.citations}
                  onCitationClick={handleCitationClick}
                />
              ))}

              {streamStarted && (
                <span>Loading..</span>
              )}

              {isStreaming && streamingText === "" && (
                <div className="animate-pulse flex gap-2 items-center text-muted-foreground p-4 text-sm">
                  <div
                    className="w-2 h-2 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              )}

              {streamError && (
                <div className="text-sm text-destructive px-4 py-2">
                  {streamError}
                </div>
              )}

              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>
      </div>

      {!isNearBottom && displayMessages.length > 0 && (
        <button
          onClick={() => {
            setIsNearBottom(true);
            scrollToBottom();
          }}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 rounded-full border bg-background px-3 py-1.5 text-xs shadow-md hover:bg-accent"
        >
          ↓ New messages
        </button>
      )}

      <ChatInput onSend={handleSend} isLoading={isStreaming} />
    </div>
  );
}

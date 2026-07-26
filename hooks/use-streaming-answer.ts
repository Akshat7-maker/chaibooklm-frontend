"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/providers/socket-provider";
import type { Message } from "@/types";

interface TokenEvent {
  conversationId: string;
  token: string;
}

interface DoneEvent {
  conversationId: string;
  message: Message;
}

interface ErrorEvent {
  conversationId: string;
  error: string;
}

export function useStreamingAnswer(conversationId: string | undefined) {
  const queryClient = useQueryClient();
  const { socket, isConnected } = useSocket();

  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);

  useEffect(() => {
    if (!socket || !isConnected || !conversationId) return;

    function onToken(payload: TokenEvent) {
      if (payload.conversationId !== conversationId) return;
      setIsStreaming(true);
      setStreamError(null);
      setStreamingText((prev) => prev + payload.token);
    }

    function onDone(payload: DoneEvent) {
      if (payload.conversationId !== conversationId) return;

      // The real, saved message is here now — push it into the same cache
      // useGetMessages reads from, same pattern as the message:new handler
      queryClient.setQueryData<{ messages: Message[] }>(
        ["message", conversationId],
        (old) => {
          if (!old) return old;
          if (old.messages.some((m) => m.id === payload.message.id)) return old;
          return { ...old, messages: [...old.messages, payload.message] };
        },
      );

      // Streaming is over — clear the live buffer, the permanent version
      // now lives in the messages cache above
      setIsStreaming(false);
      setStreamingText("");
    }

    function onError(payload: ErrorEvent) {
      if (payload.conversationId !== conversationId) return;
      setIsStreaming(false);
      setStreamingText("");
      setStreamError(payload.error);
    }

    socket.on("answer:token", onToken);
    socket.on("answer:done", onDone);
    socket.on("answer:error", onError);

    return () => {
      socket.off("answer:token", onToken);
      socket.off("answer:done", onDone);
      socket.off("answer:error", onError);
    };
  }, [socket, isConnected, conversationId, queryClient]);

  return { streamingText, isStreaming, streamError };
}
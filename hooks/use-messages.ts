"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { conversationsApi } from "@/lib/api/conversation";
import { useSocket } from "@/providers/socket-provider";
import type { Message } from "@/types";

interface MessageNewEvent {
  conversationId: string;
  message: Message;
}

export function useGetMessages(conversationId: string | undefined) {
  const queryClient = useQueryClient();
  const { socket, isConnected } = useSocket();

  const query = useQuery({
    queryKey: ["message", conversationId],
    queryFn: () => conversationsApi.getMessages(conversationId as string),
    enabled: !!conversationId,
    staleTime: Infinity, // it won't change on its own — only via the socket event below
  });

  useEffect(() => {
    if (!socket || !isConnected || !conversationId) return;

    function onNewMessage(payload: MessageNewEvent) {
      console.log("new", payload)
      if (payload.conversationId !== conversationId) return;

      queryClient.setQueryData<{ messages: Message[] }>(
        ["message", conversationId],
        (old) => {
          if (!old) return old;
          // guard against double-adding if a duplicate event ever arrives
          if (old.messages.some((m) => m.id === payload.message.id)) return old;
          return {
            ...old,
            messages: [...old.messages, payload.message],
          };
        },
      );
    }

    socket.on("message:new", onNewMessage);

    return () => {
      socket.off("message:new", onNewMessage);
    };
  }, [socket, isConnected, conversationId, queryClient]);

  return query;
}

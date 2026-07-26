"use client";

import { conversationsApi } from "@/lib/api/conversation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { question: string; resourceIds?: string[] }) =>
      conversationsApi.sendMessage(conversationId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["message", conversationId],
      });
    },
  });
}

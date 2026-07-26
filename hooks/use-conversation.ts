"use client";

import { conversationsApi } from "@/lib/api/conversation";
import { useQuery } from "@tanstack/react-query";

// ! get latest converstaion
export function useConversation(notebookId: string | undefined) {
  return useQuery({
    queryKey: ["notebooks", notebookId, "conversation"],
    queryFn: () => conversationsApi.getOrCreate(notebookId as string),
    enabled: !!notebookId,
    staleTime: Infinity, // it won't change once created — no need to refetch
  });
}

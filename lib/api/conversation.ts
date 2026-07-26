import { Conversation, Message } from "@/types";
import { apiFetch } from "../api-client";

export const conversationsApi = {
  getOrCreate: (notebookId: string) =>
    apiFetch<{ conversation: Conversation }>(
      `/notebooks/${notebookId}/conversations/current`,
    ),

  getMessages: (conversationId: string) =>
    apiFetch<{ messages: Message[] }>(
      `/conversations/${conversationId}/messages`,
    ),

  sendMessage: (
    conversationId: string,
    data: { question: string; resourceIds?: string[] },
  ) =>
    apiFetch<{ messageId: string }>(
      `/conversations/${conversationId}/chat`,
      { method: "POST", data },
    ),
};

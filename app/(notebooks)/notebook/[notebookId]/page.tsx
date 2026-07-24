"use client";

import { useParams } from "next/navigation";
import { ResourceList } from "@/components/resources/resource-list";
import { ChatInterface } from "@/components/chat/chat-interface";

export default function NotebookPage() {
  const params = useParams();
  const notebookId = params?.notebookId as string;

  if (!notebookId) {
    return null;
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden bg-background">
      {/* Left Panel: Resources Sidebar */}
      <aside className="hidden md:block w-80 shrink-0 h-full border-r bg-card/30">
        <ResourceList notebookId={notebookId} />
      </aside>

      {/* Right Panel: Chat Interface */}
      <section className="flex-1 h-full min-w-0">
        <ChatInterface notebookId={notebookId} />
      </section>
    </div>
  );
}


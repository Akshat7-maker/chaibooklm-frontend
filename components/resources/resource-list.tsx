"use client";

import { useRef, useState } from "react";
import { useResources } from "@/hooks/use-resources";
import { useUploadResource } from "@/hooks/use-upload-resource";
import { useQueryClient } from "@tanstack/react-query";
import { resourcesApi } from "@/lib/api/notebooks";
import { ResourceItem } from "./resource-item";
import { EmptyState } from "@/components/shared/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Plus, Loader2 } from "lucide-react";


interface ResourceListProps {
  notebookId: string;
}

export function ResourceList({ notebookId }: ResourceListProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { data, isLoading } = useResources(notebookId);
  const resources = data?.resources ?? [];
  const { mutateAsync: uploadResource, isPending: isUploading } = useUploadResource(notebookId);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadResource(file);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleDelete = async (resourceId: string) => {
    try {
      setIsDeletingId(resourceId);
      await resourcesApi.remove(notebookId, resourceId);
      queryClient.invalidateQueries({ queryKey: ["notebooks", notebookId, "resources"] });
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background/50 border-r">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold tracking-tight">Sources</h2>
        <Button 
          size="icon" 
          variant="outline" 
          className="w-8 h-8 rounded-full" 
          onClick={handleUploadClick}
          disabled={isUploading}
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
        </Button>
        <input 
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.vtt,.docx,.txt"
          onChange={handleFileChange}
        />
      </div>

      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 rounded-lg border bg-card shadow-sm space-y-2">
                <div className="flex gap-3 items-center">
                  <Skeleton className="w-8 h-8 rounded-md" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="h-full flex items-center justify-center mt-10">
            <EmptyState 
              icon={<FileText className="w-8 h-8" />}
              title="No sources yet"
              description="Upload documents to start building your knowledge base"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3 pb-4">
            {resources.map((resource) => (
              <div key={resource.id} className="relative">
                <ResourceItem 
                  resource={resource} 
                  onDelete={handleDelete}
                />
                {isDeletingId === resource.id && (
                  <div className="absolute inset-0 bg-background/50 rounded-lg flex items-center justify-center z-10 backdrop-blur-[1px]">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

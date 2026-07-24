"use client";

import { Resource, ResourceType } from "@/types";
import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";
import { 
  FileText, 
  Video, 
  Globe, 
  FileAudio, 
  FileType, 
  Trash2, 
  LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResourceItemProps {
  resource: Resource;
  onDelete?: (id: string) => void;
}

const getResourceIcon = (type: ResourceType): LucideIcon => {
  switch (type) {
    case "PDF":
      return FileText;
    case "YOUTUBE":
      return Video;
    case "WEBSITE":
      return Globe;
    case "VTT":
    case "AUDIO":
      return FileAudio;
    case "DOCX":
    case "TXT":
      return FileType;
    default:
      return FileText;
  }
};

export function ResourceItem({ resource, onDelete }: ResourceItemProps) {
  const Icon = getResourceIcon(resource.type);
  const isProcessing = resource.status === "PROCESSING" || resource.status === "UPLOADING";

  return (
    <div className={cn(
      "group relative flex flex-col gap-2 p-3 rounded-lg border bg-card text-card-foreground shadow-sm transition-all animate-fade-in hover-lift",
      isProcessing ? "border-primary/50 bg-primary/5" : "hover:border-primary/30"
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 rounded-md bg-muted text-muted-foreground shrink-0">
            <Icon className="w-4 h-4" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium truncate" title={resource.title}>
              {resource.title || "Untitled Resource"}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={resource.status} />
              {isProcessing && resource.currentStep && (
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {resource.currentStep}
                </span>
              )}
            </div>
          </div>
        </div>

        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(resource.id)}
            title="Delete resource"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isProcessing && typeof resource.progress === "number" && (
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${resource.progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

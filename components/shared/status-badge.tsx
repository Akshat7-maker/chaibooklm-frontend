import { Badge } from "@/components/ui/badge";
import { CheckCircle, Loader2, AlertCircle, Upload } from "lucide-react";
import type { ResourceStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  ResourceStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: typeof CheckCircle;
    iconClass: string;
  }
> = {
  UPLOADING: {
    label: "Uploading",
    variant: "outline",
    icon: Upload,
    iconClass: "text-blue-400",
  },
  PROCESSING: {
    label: "Processing",
    variant: "secondary",
    icon: Loader2,
    iconClass: "text-amber-400 animate-spin",
  },
  READY: {
    label: "Ready",
    variant: "default",
    icon: CheckCircle,
    iconClass: "text-emerald-400",
  },
  FAILED: {
    label: "Failed",
    variant: "destructive",
    icon: AlertCircle,
    iconClass: "",
  },
};

export function StatusBadge({ status }: { status: ResourceStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1.5 text-xs font-medium">
      <Icon className={cn("size-3", config.iconClass)} />
      {config.label}
    </Badge>
  );
}

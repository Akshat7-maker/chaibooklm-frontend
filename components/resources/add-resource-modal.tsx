"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useUploadResource, useAddWebResource } from "@/hooks/use-upload-resource";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Globe,
  Video,
  FileAudio,
  FileType,
  Upload,
  X,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Plus,
  Sparkles,
} from "lucide-react";
import { ResourceType } from "@/types";


/* ─────────────────────────── constants ─────────────────────────── */

interface SourceOption {
  type: ResourceType;
  label: string;
  description: string;
  icon: typeof FileText;
  accept?: string; // for file inputs
  isUrl?: boolean; // for URL-based sources
  placeholder?: string;
  gradient: string; // card accent
}

const SOURCE_OPTIONS: SourceOption[] = [
  {
    type: "PDF",
    label: "PDF",
    description: "Upload research papers, reports, and documents",
    icon: FileText,
    accept: ".pdf",
    gradient: "from-red-500/20 to-orange-500/20",
  },
  {
    type: "YOUTUBE",
    label: "YouTube",
    description: "Paste a video link to extract transcripts",
    icon: Video,
    isUrl: true,
    placeholder: "https://youtube.com/watch?v=...",
    gradient: "from-red-500/20 to-pink-500/20",
  },
  {
    type: "WEBSITE",
    label: "Website",
    description: "Enter a URL to extract page content",
    icon: Globe,
    isUrl: true,
    placeholder: "https://example.com/article",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    type: "DOCX",
    label: "DOCX",
    description: "Upload Word documents",
    icon: FileType,
    accept: ".docx",
    gradient: "from-blue-500/20 to-indigo-500/20",
  },
  {
    type: "TXT",
    label: "Text",
    description: "Upload plain text files",
    icon: FileType,
    accept: ".txt",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    type: "VTT",
    label: "VTT / Subtitles",
    description: "Upload subtitle or transcript files",
    icon: FileAudio,
    accept: ".vtt",
    gradient: "from-violet-500/20 to-purple-500/20",
  },
];

const SUPPORTED_EXTENSIONS = new Set([
  ".pdf",
  ".docx",
  ".txt",
  ".vtt",
]);

function getExtension(filename: string): string {
  const dot = filename.lastIndexOf(".");
  return dot >= 0 ? filename.slice(dot).toLowerCase() : "";
}

function detectResourceType(file: File): ResourceType | null {
  const ext = getExtension(file.name);
  switch (ext) {
    case ".pdf":
      return "PDF";
    case ".docx":
      return "DOCX";
    case ".txt":
      return "TXT";
    case ".vtt":
      return "VTT";
    default:
      return null;
  }
}

/* ─────────────────────────── component ─────────────────────────── */

interface AddResourceModalProps {
  notebookId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddResourceModal({
  notebookId,
  open,
  onOpenChange,
}: AddResourceModalProps) {
  /* ---------- state ---------- */
  const [activeTab, setActiveTab] = useState<"choose" | "url" | "file">("choose");
  const [selectedSource, setSelectedSource] = useState<SourceOption | null>(null);
  const [urlValue, setUrlValue] = useState("");
  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [unsupportedFile, setUnsupportedFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------- mutations ---------- */
  const { mutateAsync: uploadFile, isPending: isUploading } =
    useUploadResource(notebookId);
  const { mutateAsync: addWebResource, isPending: isAddingWeb } =
    useAddWebResource(notebookId);
  const isPending = isUploading || isAddingWeb;

  /* ---------- helpers ---------- */
  const reset = useCallback(() => {
    setActiveTab("choose");
    setSelectedSource(null);
    setUrlValue("");
    setDroppedFile(null);
    setDragActive(false);
    setUnsupportedFile(null);
    setError(null);
    setSuccess(false);
  }, []);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) reset();
      onOpenChange(next);
    },
    [onOpenChange, reset]
  );

  /* ---------- source card click ---------- */
  const handleSourceSelect = (source: SourceOption) => {
    setSelectedSource(source);
    setError(null);
    setUnsupportedFile(null);
    setDroppedFile(null);
    setUrlValue("");
    if (source.isUrl) {
      setActiveTab("url");
    } else {
      setActiveTab("file");
    }
  };

  /* ---------- drag & drop ---------- */
  const handleDrag = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        // Only deactivate if leaving the container (not entering a child)
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const { clientX, clientY } = e;
        if (
          clientX <= rect.left ||
          clientX >= rect.right ||
          clientY <= rect.top ||
          clientY >= rect.bottom
        ) {
          setDragActive(false);
        }
      }
    },
    []
  );

  const processFile = useCallback(
    (file: File) => {
      const type = detectResourceType(file);
      if (!type) {
        const ext = getExtension(file.name) || "unknown";
        setUnsupportedFile(ext);
        setDroppedFile(null);
        setSelectedSource(null);
        return;
      }
      setUnsupportedFile(null);
      // auto-select matching source
      const match = SOURCE_OPTIONS.find((s) => s.type === type);
      if (match) setSelectedSource(match);
      setDroppedFile(file);
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      const file = e.dataTransfer?.files?.[0];
      if (file) {
        processFile(file);
        setActiveTab("file");
      }
    },
    [processFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      // reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [processFile]
  );

  /* ---------- submit ---------- */
  const handleSubmit = async () => {
    setError(null);

    try {
      if (selectedSource?.isUrl) {
        if (!urlValue.trim()) {
          setError("Please enter a URL");
          return;
        }
        // Basic URL validation
        try {
          new URL(urlValue.trim());
        } catch {
          setError("Please enter a valid URL");
          return;
        }
        await addWebResource({
          url: urlValue.trim(),
          type: selectedSource.type as "YOUTUBE" | "WEBSITE",
        });
      } else {
        if (!droppedFile) {
          setError("Please select a file");
          return;
        }
        await uploadFile(droppedFile);
      }
      setSuccess(true);
      setTimeout(() => handleOpenChange(false), 1200);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    }
  };

  /* ---------- render ---------- */
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-[600px] overflow-hidden p-0"
        showCloseButton={false}
      >
        {/* ── header ── */}
        <div className="relative px-6 pt-6 pb-4">
          {/* Decorative gradient orb */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -top-10 -left-10 h-24 w-24 rounded-full bg-chart-3/10 blur-2xl" />

          <div className="flex items-center justify-between relative">
            <DialogHeader className="space-y-1">
              <DialogTitle className="flex items-center gap-2 text-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Plus className="h-4 w-4" />
                </div>
                Add Source
              </DialogTitle>
              <DialogDescription>
                Upload files or paste links to build your knowledge base.
              </DialogDescription>
            </DialogHeader>
            <Button
              variant="ghost"
              size="icon-sm"
              className="relative shrink-0"
              onClick={() => handleOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* ── body ── */}
        <div
          className="relative px-6 pb-6"
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          {/* ── full-screen drag overlay ── */}
          {dragActive && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 rounded-b-xl border-2 border-dashed border-primary bg-primary/5 backdrop-blur-sm transition-all">
              <div className="rounded-2xl bg-primary/10 p-4 ring-4 ring-primary/5">
                <Upload className="h-8 w-8 text-primary animate-bounce" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">
                  Drop your file here
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, DOCX, TXT, or VTT
                </p>
              </div>
            </div>
          )}

          {/* ── success state ── */}
          {success ? (
            <div className="flex flex-col items-center gap-4 py-10 animate-scale-in">
              <div className="rounded-full bg-emerald-500/10 p-4 ring-4 ring-emerald-500/5">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">
                  Source added successfully
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Processing will begin automatically
                </p>
              </div>
            </div>
          ) : activeTab === "choose" ? (
            /* ── source type picker ── */
            <>
              {/* Unsupported file warning */}
              {unsupportedFile && (
                <div className="mb-4 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 animate-slide-down">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-destructive">
                      Unsupported file format
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      <span className="font-mono font-semibold text-destructive/80">{unsupportedFile}</span>{" "}
                      files are not supported. Try PDF, DOCX, TXT, or VTT.
                    </p>
                  </div>
                </div>
              )}

              {/* Drag hint */}
              <div className="mb-4 flex items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
                <Upload className="h-3.5 w-3.5" />
                <span>Drag & drop a file anywhere on this modal, or choose a source type below</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SOURCE_OPTIONS.map((source) => {
                  const Icon = source.icon;
                  return (
                    <button
                      key={source.type}
                      onClick={() => handleSourceSelect(source)}
                      className={cn(
                        "group relative flex flex-col items-center gap-2.5 rounded-xl border border-border/50 bg-card p-4 text-center transition-all duration-200",
                        "hover:border-primary/40 hover:bg-primary/[0.03] hover:shadow-lg hover:shadow-primary/5",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                        "active:scale-[0.97]"
                      )}
                    >
                      {/* Gradient glow on hover */}
                      <div
                        className={cn(
                          "absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                          source.gradient
                        )}
                      />
                      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-muted/80 text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="relative">
                        <p className="text-sm font-medium text-foreground">
                          {source.label}
                        </p>
                        <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground line-clamp-2">
                          {source.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : activeTab === "url" && selectedSource ? (
            /* ── URL input view ── */
            <div className="space-y-4 animate-fade-in">
              <button
                onClick={() => {
                  setActiveTab("choose");
                  setSelectedSource(null);
                  setUrlValue("");
                  setError(null);
                }}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to sources
              </button>

              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-foreground",
                    selectedSource.gradient
                  )}
                >
                  <selectedSource.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    Add {selectedSource.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedSource.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">URL</label>
                <div className="relative">
                  <selectedSource.icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={selectedSource.placeholder}
                    value={urlValue}
                    onChange={(e) => {
                      setUrlValue(e.target.value);
                      setError(null);
                    }}
                    className="pl-10"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive animate-slide-down">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!urlValue.trim() || isPending}
                  className="min-w-[100px]"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-1.5" />
                      Add Source
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : activeTab === "file" ? (
            /* ── file upload view ── */
            <div className="space-y-4 animate-fade-in">
              <button
                onClick={() => {
                  setActiveTab("choose");
                  setSelectedSource(null);
                  setDroppedFile(null);
                  setError(null);
                  setUnsupportedFile(null);
                }}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to sources
              </button>

              {selectedSource && (
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-foreground",
                      selectedSource.gradient
                    )}
                  >
                    <selectedSource.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      Upload {selectedSource.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedSource.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Drop zone / file preview */}
              {droppedFile ? (
                <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/[0.03] p-4 animate-scale-in">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {droppedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(droppedFile.size / 1024).toFixed(1)} KB ·{" "}
                      {getExtension(droppedFile.name).toUpperCase().replace(".", "")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      setDroppedFile(null);
                      setUnsupportedFile(null);
                    }}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "group relative flex w-full flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 transition-all duration-200",
                    "border-border/60 bg-muted/20 hover:border-primary/40 hover:bg-primary/[0.03]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  )}
                >
                  <div className="rounded-2xl bg-muted/60 p-3 text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">
                      Click to browse or drag & drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedSource
                        ? `${selectedSource.accept?.replace(".", "").toUpperCase()} files only`
                        : "PDF, DOCX, TXT, or VTT"}
                    </p>
                  </div>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={selectedSource?.accept ?? SUPPORTED_EXTENSIONS.size > 0 ? Array.from(SUPPORTED_EXTENSIONS).join(",") : undefined}
                onChange={handleFileSelect}
              />

              {/* Unsupported warning */}
              {unsupportedFile && (
                <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 animate-slide-down">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-destructive">
                      Unsupported file format
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      <span className="font-mono font-semibold text-destructive/80">
                        {unsupportedFile}
                      </span>{" "}
                      files are not supported. Try PDF, DOCX, TXT, or VTT.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive animate-slide-down">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!droppedFile || isPending}
                  className="min-w-[100px]"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-1.5" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

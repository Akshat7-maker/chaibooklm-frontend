export interface User {
  id: string;
  name: string;
  email: string;
}

export type ResourceType = "PDF" | "YOUTUBE" | "WEBSITE" | "VTT" | "DOCX" | "TXT" | "AUDIO";
export type ResourceStatus = "UPLOADING" | "PROCESSING" | "READY" | "FAILED";

export interface Resource {
  id: string;
  notebookId: string;
  title: string;
  type: ResourceType;
  status: ResourceStatus;
  progress: number;
  currentStep: string | null;
  errorMessage: string | null;
  originalUrl: string | null;
  storagePath: string | null;
  indexedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Notebook {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceUpdateEvent {
  resourceId: string;
  status: ResourceStatus;
  progress?: number;
  currentStep?: string | null;
  errorMessage?: string;
}
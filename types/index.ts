export interface User {
  id: string;
  name: string;
  email: string;
}

export type ResourceType = "PDF" | "YOUTUBE" | "WEBSITE" | "VTT" | "DOCX" | "TXT" | "AUDIO";
export type ResourceStatus = "UPLOADING" | "PROCESSING" | "READY" | "FAILED";

export type MessageRole = "USER" | "ASSISTANT" | "SYSTEM"
interface Citation {
  marker: number;
  resourceId: string;
  sourceType: string;
  title: string;
  startTime: number | null;
  endTime: number | null;
  page: number | null;
}
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

export interface Conversation {
  id: string;
  notebookId:String
  title:String
}

export interface Message {
  id: string;
  conversationId:String
  role:MessageRole
  content:string
  citations: Citation[]
  createdAt: Date
}
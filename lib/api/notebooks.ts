import { apiFetch } from "@/lib/api-client";
import type { Notebook, Resource } from "@/types";

export const notebooksApi = {
  list: () => apiFetch<{ notebooks: Notebook[] }>("/notebooks"),
  getOne: (id: string) => apiFetch<{ notebook: Notebook }>(`/notebooks/${id}`),
  create: (data: { title: string; description?: string }) =>
    apiFetch<{ notebook: Notebook }>("/notebooks", {
      method: "POST",
      data
    }),
  remove: (id: string) => apiFetch<{ message: string }>(`/notebooks/${id}`, { method: "DELETE" }),
};

export const resourcesApi = {
  list: (notebookId: string) =>
    apiFetch<{ resources: Resource[] }>(`/notebooks/${notebookId}/resources`),

  upload: (notebookId: string, formData: FormData) =>
    apiFetch<{ resource: Resource }>(`/notebooks/${notebookId}/resources/upload`, {
      method: "POST",
      data:formData
    }),

  remove: (notebookId: string, resourceId: string) =>
    apiFetch<{ message: string }>(`/notebooks/${notebookId}/resources/${resourceId}`, {
      method: "DELETE",
    }),
};
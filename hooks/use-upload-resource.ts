"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resourcesApi } from "@/lib/api/notebooks";

export function useUploadResource(notebookId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return resourcesApi.upload(notebookId, formData);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notebooks", notebookId, "resources"] }),
  });
}

export function useAddWebResource(notebookId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { url: string; type: "YOUTUBE" | "WEBSITE" }) =>
      resourcesApi.addWebResource(notebookId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notebooks", notebookId, "resources"] }),
  });
}
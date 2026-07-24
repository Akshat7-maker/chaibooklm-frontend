"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notebooksApi } from "@/lib/api/notebooks";

export function useNotebooks() {
  return useQuery({
    queryKey: ["notebooks"],
    queryFn: notebooksApi.list,
  });
}

export function useCreateNotebook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notebooksApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notebooks"] }),
  });
}
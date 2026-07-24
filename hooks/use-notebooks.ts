"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notebooksApi } from "@/lib/api/notebooks";
import { useAuth } from "@/providers/auth-provider";

export function useNotebooks() {
  // const { isLoading: authLoading, user } = useAuth();

  return useQuery({
    queryKey: ["notebooks"],
    queryFn: notebooksApi.list,
    // enabled: !authLoading && !!user,
  });

  // return {
  //   ...query,
  //   isLoading: authLoading || query.isLoading, // true while auth resolves OR query fetches
  // };
}

export function useCreateNotebook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notebooksApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notebooks"] }),
  });
}
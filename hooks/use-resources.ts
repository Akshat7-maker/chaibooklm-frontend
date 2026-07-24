"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { resourcesApi } from "@/lib/api/notebooks";
import { useSocket } from "@/providers/socket-provider";
import type { Resource, ResourceUpdateEvent } from "@/types";

export function useResources(notebookId: string | undefined) {
  const queryClient = useQueryClient();
  const { socket, isConnected } = useSocket();

  const query = useQuery({
    queryKey: ["notebooks", notebookId, "resources"],
    queryFn: () => resourcesApi.list(notebookId as string),
    enabled: !!notebookId,
  });

  useEffect(() => {
    if (!socket || !isConnected || !notebookId) return;

    socket.emit("notebook:join", notebookId);

    function onResourceUpdate(update: ResourceUpdateEvent) {
      queryClient.setQueryData<{ resources: Resource[] }>(
        ["notebooks", notebookId, "resources"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            resources: old.resources.map((r) =>
              r.id === update.resourceId ? { ...r, ...update } : r
            ),
          };
        }
      );
    }

    socket.on("resource:update", onResourceUpdate);

    return () => {
      socket.emit("notebook:leave", notebookId);
      socket.off("resource:update", onResourceUpdate);
    };
  }, [socket, isConnected, notebookId, queryClient]);

  return query;
}
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceService } from "@/lib/services/workspace";
import { Workspace } from "@/types";

export const getWorkspaceKey = (id: string) => ["workspaces", id];
export const listWorkspacesKey = ["workspaces"];

export function useWorkspaces() {
  return useQuery({
    queryKey: listWorkspacesKey,
    queryFn: () => workspaceService.listWorkspaces(),
  });
}

export function useWorkspace(id: string) {
  return useQuery({
    queryKey: getWorkspaceKey(id),
    queryFn: () => workspaceService.getWorkspace(id),
    enabled: !!id,
  });
}

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string, input: Partial<Workspace> }) => 
      workspaceService.updateWorkspace(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getWorkspaceKey(id) });
      queryClient.invalidateQueries({ queryKey: listWorkspacesKey });
    },
  });
}

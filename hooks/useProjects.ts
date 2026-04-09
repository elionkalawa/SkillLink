import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService, CreateProjectInput } from "@/lib/services/project";
import { useUser } from "./useUser";

export const getProjectsKey = ["projects"];
export const getUserProjectsKey = (userId: string) => ["projects", "user", userId];

export function useProjects() {
  return useQuery({
    queryKey: getProjectsKey,
    queryFn: () => projectService.getProjects(),
  });
}

export function useUserProjects() {
  const { user } = useUser();
  return useQuery({
    queryKey: getUserProjectsKey(user?.id || ""),
    queryFn: () => projectService.getUserProjects(user!.id),
    enabled: !!user?.id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: (input: CreateProjectInput) => {
      if (!user) throw new Error("Must be logged in to create a project");
      return projectService.createProject(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getProjectsKey });
      if (user) {
        queryClient.invalidateQueries({ queryKey: getUserProjectsKey(user.id) });
      }
    },
  });
}
export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string, input: Partial<CreateProjectInput> }) => 
      projectService.updateProject(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getProjectsKey });
      queryClient.invalidateQueries({ queryKey: ["projects", id] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getProjectsKey });
    },
  });
}

export function useJoinProject() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async ({ projectId, roleId }: { projectId: string; roleId?: string }) => {
      const response = await fetch(`/api/projects/${projectId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roleId }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to join project");
      }
      return response.json();
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
      if (user) {
        queryClient.invalidateQueries({ queryKey: ["projects", "user", user.id] });
      }
    },
  });
}

export function useUpdateMemberStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      projectId, 
      memberId, 
      status, 
      notificationId 
    }: { 
      projectId: string; 
      memberId: string; 
      status: 'approved' | 'rejected'; 
      notificationId?: string 
    }) => {
      const response = await fetch(`/api/projects/${projectId}/members/${memberId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notificationId }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update member status");
      }
      return response.json();
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

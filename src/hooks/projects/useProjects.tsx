import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  assignDesignersToProject,
} from "@/app/actions/projects";
import { Project, ProjectCreateInput, ProjectUpdateInput } from "@/app/types";

export const useProjects = (userId?: string) => {
  return useQuery<Project[]>({
    queryKey: ["projects", userId],
    queryFn: async () => {
      const data = await getProjects(userId);
      return data;
    },
  });
};

export const useProject = (projectId: number) => {
  return useQuery<Project>({
    queryKey: ["project", projectId],
    queryFn: () => getProjectById(projectId),
    enabled: !!projectId,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation<Project, Error, ProjectCreateInput>({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Project,
    Error,
    { projectId: number; data: ProjectUpdateInput }
  >({
    mutationFn: ({ projectId, data }) => updateProject(projectId, data),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useAssignDesigners = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { projectId: number; designerIds: string[] }>(
    {
      mutationFn: ({ projectId, designerIds }) =>
        assignDesignersToProject(projectId, designerIds),
      onSuccess: (_, { projectId }) => {
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      },
    }
  );
};

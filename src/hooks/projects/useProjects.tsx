import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjects,
  createProject,
  assignDesignersToProject,
} from "@/app/actions/projects";

export const useProjects = (userId?: string) => {
  return useQuery({
    queryKey: ["projects", userId],
    queryFn: () => getProjects(userId),
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useAssignDesigners = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      designerIds,
    }: {
      projectId: number;
      designerIds: string[];
    }) => assignDesignersToProject(projectId, designerIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

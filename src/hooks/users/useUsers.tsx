import { useQuery } from "@tanstack/react-query";
import { getUsers, getUserById, getDesigners } from "@/app/actions/users";
import { Tables } from "@/types";

export const useUsers = () => {
  return useQuery<Tables<"users">[]>({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });
};

export const useUser = (userId: string) => {
  return useQuery<Tables<"users">>({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

export const useDesigners = (projectId?: number) => {
  return useQuery<(Tables<"users"> & { is_assigned: boolean })[]>({
    queryKey: ["designers", projectId],
    queryFn: async () => {
      const data = await getDesigners(projectId);
      return data;
    },
  });
};

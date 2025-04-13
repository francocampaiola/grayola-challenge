import { useQuery } from "@tanstack/react-query";
import { getUsers, getUserById } from "@/app/actions/users";
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

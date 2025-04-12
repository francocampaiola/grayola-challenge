import { useQuery } from "@tanstack/react-query";
import { getUsers, getUserById } from "@/app/actions/users";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });
};

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ["users", userId],
    queryFn: () => getUserById(userId),
  });
};

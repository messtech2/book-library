import type { User } from "../types/user";
import { useQuery } from "@tanstack/react-query";

const fetchUser = async (): Promise<User | null> => {
  const response = await fetch("/api/auth/me");
  if (response.status === 401) {
    return null;
  }
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json() as Promise<User>;
};
export const useMe = () => {
  const { data, isLoading, isError, error, refetch } = useQuery<User | null>({
    queryKey: ["me"],
    queryFn: fetchUser,
    retry: false,
  });
  return {
    user: data ?? null,
    loading: isLoading,
    error: isError ? error : null,
    reload: () => {
      void refetch();
    },
  };
};

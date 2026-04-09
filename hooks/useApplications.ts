"use client";

import { useQuery } from "@tanstack/react-query";
import { userService } from "@/lib/services/user";
import { useUser } from "./useUser";

export function useUserApplications() {
  const { user } = useUser();
  
  return useQuery({
    queryKey: ["applications", user?.id],
    queryFn: () => userService.getUserApplications(user!.id),
    enabled: !!user?.id,
  });
}

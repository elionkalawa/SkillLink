import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/lib/services/user";
import { User } from "@/types";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Partial<User>) => userService.updateProfile(input),
    onSuccess: (updatedUser) => {
      // Update local storage or session if needed, or just invalidate
      queryClient.setQueryData(["user"], updatedUser);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

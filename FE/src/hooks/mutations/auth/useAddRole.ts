import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../../../services";

export function useAddRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { role: string }) => authService.addRole(payload),
    onSuccess: () => {
      // Refresh available roles
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

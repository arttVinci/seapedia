import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addressService } from "../../../services";
import { ApiError } from "../../../api/apiError";

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => addressService.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: (error: Error | ApiError) => {
      console.error("Delete address failed:", error.message);
    },
  });
}

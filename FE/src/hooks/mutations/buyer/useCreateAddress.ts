import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addressService } from "../../../services";
import type { CreateAddressPayload } from "../../../@types/models";
import { ApiError } from "../../../api/apiError";

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAddressPayload) =>
      addressService.createAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: (error: Error | ApiError) => {
      console.error("Create address failed:", error.message);
    },
  });
}

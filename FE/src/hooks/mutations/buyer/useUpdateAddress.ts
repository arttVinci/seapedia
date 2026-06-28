import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addressService } from "../../../services";
import type { UpdateAddressPayload } from "../../../@types/models";
import { ApiError } from "../../../api/apiError";

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAddressPayload;
    }) => addressService.updateAddress(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: (error: Error | ApiError) => {
      console.error("Update address failed:", error.message);
    },
  });
}

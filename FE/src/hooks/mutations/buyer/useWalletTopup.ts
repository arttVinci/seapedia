import { useMutation, useQueryClient } from "@tanstack/react-query";
import { walletService } from "../../../services";
import type { WalletTopupPayload } from "../../../@types/models";
import { ApiError } from "../../../api/apiError";

export function useWalletTopup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WalletTopupPayload) => walletService.topup(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
    onError: (error: Error | ApiError) => {
      console.error("Topup failed:", error.message);
    },
  });
}

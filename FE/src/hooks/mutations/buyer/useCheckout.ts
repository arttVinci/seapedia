import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CheckoutRequest, CheckoutResponse } from "@/@types/models";
import { checkoutService } from "@/services";
import type { ApiError } from "@/api/apiError";

export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation<CheckoutResponse, ApiError, CheckoutRequest>({
    mutationFn: (payload) => checkoutService.checkout(payload),
    onSuccess: () => {
      // Invalidate cart and wallet queries since checkout will clear cart and deduct balance
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
};
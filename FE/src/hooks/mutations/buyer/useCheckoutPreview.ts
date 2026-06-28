import { useMutation } from "@tanstack/react-query";
import type { CheckoutPreviewRequest, CheckoutPreviewResponse } from "@/@types/models";
import { checkoutService } from "@/services";
import type { ApiError } from "@/api/apiError";

export const useCheckoutPreview = () => {
  return useMutation<CheckoutPreviewResponse, ApiError, CheckoutPreviewRequest>({
    mutationFn: (payload) => checkoutService.preview(payload),
  });
};
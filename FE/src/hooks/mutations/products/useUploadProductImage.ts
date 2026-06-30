import { useMutation } from "@tanstack/react-query";
import { sellerProductService } from "@/services/sellerProductService";
import { ApiError } from "@/api/apiError";

interface UseUploadImageOptions {
  onSuccess?: (imageUrl: string) => void;
  onError?: (error: ApiError) => void;
}

export const useUploadProductImage = (options?: UseUploadImageOptions) => {
  return useMutation<string, ApiError, FormData>({
    mutationFn: (formData) => sellerProductService.uploadImage(formData),
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

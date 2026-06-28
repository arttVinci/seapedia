import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sellerProductService } from '../../../services/sellerProductService';
import type { CreateProductPayload } from '../../../@types/models';

export function useCreateProduct(options?: { onSuccess?: () => void; onError?: (error: any) => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductPayload) => sellerProductService.createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerProducts'] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sellerProductService } from '../services/sellerProductService';
import type { CreateProductPayload } from '../@types/models';

export function useCreateProduct(sellerId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductPayload) => sellerProductService.createProduct(sellerId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerProducts'] });
    },
  });
}

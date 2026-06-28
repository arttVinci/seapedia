import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sellerProductService } from '../services/sellerProductService';
import type { UpdateProductPayload } from '../@types/models';

export function useUpdateProduct(sellerId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateProductPayload }) => 
      sellerProductService.updateProduct(sellerId, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerProducts'] });
    },
  });
}

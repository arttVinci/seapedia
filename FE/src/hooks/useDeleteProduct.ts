import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sellerProductService } from '../services/sellerProductService';

export function useDeleteProduct(sellerId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => sellerProductService.deleteProduct(sellerId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerProducts'] });
    },
  });
}

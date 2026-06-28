import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sellerProductService } from '../../../services/sellerProductService';

export function useDeleteProduct(options?: { onSuccess?: () => void; onError?: (error: any) => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => sellerProductService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerProducts'] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

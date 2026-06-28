import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sellerProductService } from '../../../services/sellerProductService';
import type { UpdateProductPayload } from '../../../@types/models';

export function useUpdateProduct(options?: { onSuccess?: () => void; onError?: (error: any) => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductPayload }) => 
      sellerProductService.updateProduct(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerProducts'] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

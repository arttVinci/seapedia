import { useMutation, useQueryClient } from '@tanstack/react-query';
import { storeService } from '../../../services/storeService';
import type { UpdateStorePayload } from '../../../@types/models';

export function useUpdateStore(options?: { onSuccess?: () => void; onError?: (error: any) => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateStorePayload) => storeService.updateStore(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerStore'] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

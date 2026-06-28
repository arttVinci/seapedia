import { useMutation, useQueryClient } from '@tanstack/react-query';
import { storeService } from '../../../services/storeService';
import type { CreateStorePayload } from '../../../@types/models';

export function useCreateStore(options?: { onSuccess?: () => void; onError?: (error: any) => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateStorePayload) => storeService.createStore(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerStore'] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { storeService } from '../services/storeService';
import type { CreateStorePayload } from '../@types/models';

export function useCreateStore(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateStorePayload) => storeService.createStore(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerStore'] });
    },
  });
}

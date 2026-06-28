import { useMutation, useQueryClient } from '@tanstack/react-query';
import { storeService } from '../services/storeService';
import type { UpdateStorePayload } from '../@types/models';

export function useUpdateStore(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateStorePayload) => storeService.updateStore(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerStore'] });
    },
  });
}

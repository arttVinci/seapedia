import { useQuery } from '@tanstack/react-query';
import { storeService } from '../../../services/storeService';

export function usePublicStore(id: string) {
  return useQuery({
    queryKey: ['publicStore', id],
    queryFn: () => storeService.getPublicStore(id),
    enabled: !!id,
  });
}

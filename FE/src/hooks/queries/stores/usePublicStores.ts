import { useQuery } from '@tanstack/react-query';
import { storeService } from '../../../services/storeService';

export function usePublicStores() {
  return useQuery({
    queryKey: ['publicStores'],
    queryFn: () => storeService.getAllStores(),
  });
}

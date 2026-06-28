import { useQuery } from '@tanstack/react-query';
import { storeService } from '../../../services/storeService';
import { useAuth } from '../../../contexts/AuthContext';

export function useSellerStore() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['sellerStore', user?.id],
    queryFn: () => storeService.getMyStore(),
    enabled: !!user?.id,
  });
}

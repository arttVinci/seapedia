import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';

export function useStoreProducts(storeUserId: string) {
  return useQuery({
    queryKey: ['storeProducts', storeUserId],
    queryFn: () => productService.getProductsByStore(storeUserId),
    enabled: !!storeUserId,
  });
}

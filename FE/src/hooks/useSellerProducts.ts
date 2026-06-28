import { useQuery } from '@tanstack/react-query';
import { sellerProductService } from '../services/sellerProductService';

export function useSellerProducts(sellerId: number, page: number, limit: number, name?: string) {
  return useQuery({
    queryKey: ['sellerProducts', sellerId, page, limit, name],
    queryFn: () => sellerProductService.getMyProducts(sellerId, page, limit, name),
    enabled: !!sellerId,
  });
}

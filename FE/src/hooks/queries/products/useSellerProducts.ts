import { useQuery } from '@tanstack/react-query';
import { sellerProductService } from '../../../services/sellerProductService';
import type { SearchParams } from '../../../@types/base/api.types';

export function useSellerProducts(params: SearchParams) {
  return useQuery({
    queryKey: ['sellerProducts', params.page, params.size, params.title],
    queryFn: () => sellerProductService.getMyProducts(params),
  });
}

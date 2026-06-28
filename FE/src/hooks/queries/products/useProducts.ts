import { useQuery } from '@tanstack/react-query';
import { productService } from '../../../services/productService';
import type { SearchParams } from '../../../@types/base/api.types';

export function useProducts(params: SearchParams) {
  return useQuery({
    queryKey: ['products', params.page, params.size, params.title],
    queryFn: () => productService.getProducts(params),
  });
}

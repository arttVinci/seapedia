import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { productService } from '../../../services/productService';
import type { SearchParams } from '../../../@types/base/api.types';

export function useProducts(params: SearchParams) {
  return useQuery({
    queryKey: ['products', params.page, params.size, params.name, params.category],
    queryFn: () => productService.getProducts(params),
    placeholderData: keepPreviousData,
  });
}

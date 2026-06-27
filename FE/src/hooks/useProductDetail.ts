import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';

export function useProductDetail(id: number) {
  return useQuery({
    queryKey: ['productDetail', id],
    queryFn: () => productService.getProductDetail(id),
    enabled: !!id,
  });
}

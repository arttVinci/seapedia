import { useQuery } from '@tanstack/react-query';
import { productService } from '../../../services/productService';

export function useProductDetail(id: string) {
  return useQuery({
    queryKey: ['productDetail', id],
    queryFn: () => productService.getProductDetail(id),
    enabled: !!id,
  });
}

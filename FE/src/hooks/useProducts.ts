import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';

export function useProducts(page = 1, limit = 8) {
  return useQuery({
    queryKey: ['products', page, limit],
    queryFn: () => productService.getProducts(page, limit),
  });
}

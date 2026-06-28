import { useQuery } from '@tanstack/react-query';
import { cartService } from '../../../services/cartService';

export const CART_QUERY_KEY = ['cart'];

export function useCart() {
  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: () => cartService.getCart(),
    select: (data) => data.data,
  });
}

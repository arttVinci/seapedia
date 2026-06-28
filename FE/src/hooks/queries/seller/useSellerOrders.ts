import { useQuery } from '@tanstack/react-query';
import orderService from '../../../services/orderService';
import type { Order } from '../../../@types/models';

export const SELLER_ORDERS_KEY = ['seller', 'orders'];

export function useSellerOrders() {
  return useQuery({
    queryKey: SELLER_ORDERS_KEY,
    queryFn: async () => {
      const res = await orderService.getSellerOrders();
      return res;
    },
  });
}

import { useQuery } from '@tanstack/react-query';
import orderService from '../../../services/orderService';
import type { OrderDetail } from '../../../@types/models';

export const SELLER_ORDER_DETAIL_KEY = (id: string) => ['seller', 'order', id];

export function useSellerOrderDetail(id: string) {
  return useQuery<OrderDetail>({
    queryKey: SELLER_ORDER_DETAIL_KEY(id),
    queryFn: async () => orderService.getSellerOrderDetail(id),
    enabled: !!id,
  });
}

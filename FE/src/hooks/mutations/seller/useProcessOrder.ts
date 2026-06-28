import { useMutation, useQueryClient } from '@tanstack/react-query';
import orderService from '../../../services/orderService';
import { SELLER_ORDERS_KEY } from '../../queries/seller/useSellerOrders';

export function useProcessOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => orderService.processOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SELLER_ORDERS_KEY });
    },
  });
}

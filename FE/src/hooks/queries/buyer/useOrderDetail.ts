import { useQuery } from "@tanstack/react-query";
import type { OrderDetail } from "@/@types/models";
import { orderService } from "@/services";

export const useOrderDetail = (id: string) => {
  return useQuery<OrderDetail>({
    queryKey: ["orders", id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
  });
};
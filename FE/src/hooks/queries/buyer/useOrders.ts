import { useQuery } from "@tanstack/react-query";
import type { Order } from "@/@types/models";
import { orderService } from "@/services";

export const useOrders = () => {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: () => orderService.getOrders(),
  });
};
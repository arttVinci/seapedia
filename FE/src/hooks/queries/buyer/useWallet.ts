import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { walletService } from "../../../services";

export function useWallet(options?: Omit<UseQueryOptions<any, any, any, any>, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: ["wallet"],
    queryFn: () => walletService.getWallet(),
    ...options,
  });
}

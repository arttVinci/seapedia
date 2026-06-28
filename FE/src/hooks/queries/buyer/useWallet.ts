import { useQuery } from "@tanstack/react-query";
import { walletService } from "../../../services";

export function useWallet() {
  return useQuery({
    queryKey: ["wallet"],
    queryFn: () => walletService.getWallet(),
  });
}

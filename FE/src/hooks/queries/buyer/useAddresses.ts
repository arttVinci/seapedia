import { useQuery } from "@tanstack/react-query";
import { addressService } from "../../../services";

export function useAddresses() {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: () => addressService.getAddresses(),
  });
}

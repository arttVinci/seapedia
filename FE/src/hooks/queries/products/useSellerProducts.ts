import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { sellerProductService } from "../../../services/sellerProductService";
import type { SearchParams } from "../../../@types/base/api.types";

export function useSellerProducts(params: SearchParams) {
  return useQuery({
    queryKey: ["sellerProducts", params.page, params.size, params.name, params.category],
    queryFn: () => sellerProductService.getMyProducts(params),
    placeholderData: keepPreviousData,
  });
}

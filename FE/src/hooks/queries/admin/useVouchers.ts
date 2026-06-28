import { useQuery } from '@tanstack/react-query';
import { discountService } from '../../../services/discountService';

export const VOUCHERS_QUERY_KEY = ['vouchers'];

export function useVouchers() {
  return useQuery({
    queryKey: VOUCHERS_QUERY_KEY,
    queryFn: () => discountService.getVouchers(),
  });
}

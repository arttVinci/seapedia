import { useQuery } from '@tanstack/react-query';
import { discountService } from '../../../services/discountService';

export const PROMOS_QUERY_KEY = ['promos'];

export function usePromos() {
  return useQuery({
    queryKey: PROMOS_QUERY_KEY,
    queryFn: () => discountService.getPromos(),
  });
}

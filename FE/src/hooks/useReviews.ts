import { useQuery } from '@tanstack/react-query';
import { reviewService } from '../services/reviewService';

export function useReviews(productId: number, page = 1, limit = 5) {
  return useQuery({
    queryKey: ['reviews', productId, page, limit],
    queryFn: () => reviewService.getReviews(productId, page, limit),
    enabled: !!productId,
  });
}

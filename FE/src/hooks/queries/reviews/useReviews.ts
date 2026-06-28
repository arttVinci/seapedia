import { useQuery } from '@tanstack/react-query';
import { reviewService } from '../../../services';

export function useReviews() {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: () => reviewService.getReviews(),
  });
}
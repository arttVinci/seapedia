import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../services/reviewService';
import { CreateReviewPayload } from '../@types/models';

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => reviewService.createReview(payload),
    onSuccess: (_, variables) => {
      // Invalidate the reviews cache so it refetches
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.product_id] });
    },
  });
}

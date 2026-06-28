import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../../../services';
import type { CreateReviewPayload } from '../../../@types/models';

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => reviewService.createReview(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}
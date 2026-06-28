import { useMutation, useQueryClient } from '@tanstack/react-query';
import { discountService } from '../../../services/discountService';
import { PROMOS_QUERY_KEY } from '../../queries/admin/usePromos';
import type { CreatePromoPayload } from '../../../@types/models';
import type { ApiErrorResponse } from '../../../@types/api/response.types';
import { AxiosError } from 'axios';

export function useCreatePromo(options?: { onSuccess?: () => void; onError?: (error: AxiosError<ApiErrorResponse>) => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePromoPayload) => discountService.createPromo(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMOS_QUERY_KEY });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { discountService } from '../../../services/discountService';
import { VOUCHERS_QUERY_KEY } from '../../queries/admin/useVouchers';
import type { CreateVoucherPayload } from '../../../@types/models';
import type { ApiErrorResponse } from '../../../@types/api/response.types';
import { AxiosError } from 'axios';

export function useCreateVoucher(options?: { onSuccess?: () => void; onError?: (error: AxiosError<ApiErrorResponse>) => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateVoucherPayload) => discountService.createVoucher(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VOUCHERS_QUERY_KEY });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

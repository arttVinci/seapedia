import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../../../services/cartService';
import { CART_QUERY_KEY } from '../../queries/buyer/useCart';
import type { UpdateCartItemPayload } from '../../../@types/models';
import type { ApiErrorResponse } from '../../../@types/api/response.types';
import { AxiosError } from 'axios';

export function useUpdateCartItem(options?: { onSuccess?: () => void; onError?: (error: AxiosError<ApiErrorResponse>) => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCartItemPayload }) => cartService.updateCartItem(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

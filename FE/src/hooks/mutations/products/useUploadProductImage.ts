import { useMutation } from '@tanstack/react-query';
import { sellerProductService } from '../../../services/sellerProductService';

export function useUploadProductImage(options?: { onSuccess?: (url: string) => void; onError?: (error: any) => void }) {
  return useMutation({
    mutationFn: ({ file, id }: { file: File; id?: string }) => sellerProductService.uploadProductImage(file, id),
    onSuccess: (url) => {
      options?.onSuccess?.(url);
    },
    onError: options?.onError,
  });
}

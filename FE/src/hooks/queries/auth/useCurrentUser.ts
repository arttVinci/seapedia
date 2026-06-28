import { useQuery } from '@tanstack/react-query';
import { authService } from '../../../services';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authService.getCurrentUser(),
    retry: false, // Jangan retry jika token tidak valid/tidak ada
  });
}
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../../services';
import { useAuth } from '../../../contexts/AuthContext';

export function useLogout() {
  const { handleLogout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      handleLogout();
      queryClient.clear(); // Bersihkan semua cache
    },
    // Kalau error pun (misal sudah expired), tetap logout di sisi client
    onError: () => {
      handleLogout();
      queryClient.clear();
    }
  });
}
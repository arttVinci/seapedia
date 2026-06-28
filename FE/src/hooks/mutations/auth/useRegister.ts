import { useMutation } from '@tanstack/react-query';
import { authService } from '../../../services';
import type { RegisterPayload } from '../../../@types/models';
import { useAuth } from '../../../contexts/AuthContext';

export function useRegister() {
  const { handleLoginSuccess } = useAuth();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (data) => {
      // Simpan token ke localStorage & panggil callback di context
      handleLoginSuccess(data.token);
    },
  });
}
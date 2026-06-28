import { useMutation } from '@tanstack/react-query';
import { authService } from '../../../services';
import type { LoginPayload } from '../../../@types/models';
import { useAuth } from '../../../contexts/AuthContext';

export function useLogin() {
  const { handleLoginSuccess } = useAuth();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data) => {
      // Simpan token ke localStorage & panggil callback di context
      handleLoginSuccess(data.token);
    },
  });
}
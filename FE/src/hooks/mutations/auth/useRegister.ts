import { useMutation } from '@tanstack/react-query';
import { authService } from '../../../services';
import type { RegisterPayload } from '../../../@types/models';
import { useNavigate } from 'react-router-dom';

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: () => {
      navigate('/login');
    },
  });
}

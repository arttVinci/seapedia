import { useMutation } from '@tanstack/react-query';
import { authService } from '../../../services';
import type { SelectRolePayload } from '../../../@types/models';
import { useAuth } from '../../../contexts/AuthContext';

export function useSelectRole() {
  const { handleSelectRoleSuccess } = useAuth();

  return useMutation({
    mutationFn: (payload: SelectRolePayload) => authService.selectRole(payload),
    onSuccess: (data) => {
      handleSelectRoleSuccess(data.token, data.active_role);
    },
  });
}
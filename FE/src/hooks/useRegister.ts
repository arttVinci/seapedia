import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import { RegisterPayload } from "../@types/models";

export function useRegister() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (data) => {
      login(data.user, data.token);
    },
  });
}

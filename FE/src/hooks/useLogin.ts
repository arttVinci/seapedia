import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import { LoginPayload } from "../@types/models";

export function useLogin() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data) => {
      login(data.user, data.token);
    },
  });
}

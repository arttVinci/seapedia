import { useQuery } from "@tanstack/react-query";
import { authService } from "../../../services";
import { useAuth } from "../../../contexts/AuthContext";

export function useRoles() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ["roles"],
    queryFn: () => authService.getRoles(),
    enabled: !!token,
  });
}

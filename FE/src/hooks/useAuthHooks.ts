import { useAuth } from "../contexts/AuthContext";

export function useLogout() {
  const { logout } = useAuth();
  return logout;
}

export function useCurrentUser() {
  const { user } = useAuth();
  return user;
}

export function useUserRoles() {
  const { user } = useAuth();
  return user?.roles || [];
}

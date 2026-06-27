import { useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";

export function useSelectRole() {
  const { setActiveRole, activeRole } = useAuth();

  const selectRole = useCallback(
    (role: string) => {
      setActiveRole(role);
    },
    [setActiveRole]
  );

  return { selectRole, activeRole };
}

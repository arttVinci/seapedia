import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function ProtectedRoute() {
  const { token, activeRole, user } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If user has multiple roles and hasn't selected one yet
  if (user && user.roles.length > 1 && !activeRole) {
    return <Navigate to="/select-role" replace />;
  }

  return <Outlet />;
}

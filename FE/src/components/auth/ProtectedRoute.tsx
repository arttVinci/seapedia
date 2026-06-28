import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function ProtectedRoute() {
  const { token, activeRole } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika sudah login tapi belum memilih peran
  if (!activeRole) {
    return <Navigate to="/select-role" replace />;
  }

  return <Outlet />;
}

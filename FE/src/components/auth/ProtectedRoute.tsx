import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function ProtectedRoute() {
  const { token, activeRole } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika sudah login tapi belum memilih peran
  if (!activeRole) {
    return <Navigate to="/select-role" replace />;
  }

  // Validasi agar peran A tidak bisa mengakses halaman peran B
  const rolePrefixes = ["/buyer", "/seller", "/driver", "/admin"];
  for (const prefix of rolePrefixes) {
    if (location.pathname.startsWith(prefix)) {
      const requiredRole = prefix.substring(1);
      if (activeRole !== requiredRole) {
        // Arahkan ke dashboard peran yang sedang aktif
        return <Navigate to={`/${activeRole}`} replace />;
      }
    }
  }

  return <Outlet />;
}

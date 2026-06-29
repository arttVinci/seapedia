import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function GuestRoute() {
  const { token } = useAuth();

  // If user is already logged in, redirect them to homepage
  if (token) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the child routes (e.g., login, register)
  return <Outlet />;
}

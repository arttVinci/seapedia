import { Outlet } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import { useAuth } from "../contexts/AuthContext";

export function PublicLayout() {
  const { token, activeRole } = useAuth();
  const isLoggedIn = !!token;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} activeRole={activeRole || undefined} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

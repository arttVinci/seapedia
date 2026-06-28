import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLogout } from "../../hooks/mutations/auth/useLogout";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const { token, activeRole } = useAuth();
  const logoutMutation = useLogout();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate("/"),
      onError: () => navigate("/"),
    });
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white border-b border-neutral-300">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between p-3 lg:px-8">
        {/* Logo + Brand name */}
        <Link to="/" className="flex items-center gap-x-2">
          <span className="text-xl font-semibold tracking-wide text-gray-900">SEAPEDIA</span>
        </Link>

        {/* Nav links - tengah (hidden on mobile) */}
        <div className="hidden lg:flex lg:gap-x-8">
          <Link to="/catalog" className="text-sm font-semibold text-gray-900 hover:text-gray-600">Katalog</Link>
          {token && <Link to={`/${activeRole}/dashboard`} className="text-sm font-semibold text-gray-900 hover:text-gray-600">Dashboard</Link>}
        </div>

        {/* Right side - auth buttons or user menu */}
        <div className="flex items-center gap-x-4">
          {!token ? (
            <>
              <Link to="/login" className="text-sm font-semibold text-gray-900 hover:text-gray-600">Log in</Link>
              <Link to="/register" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700">Sign up</Link>
            </>
          ) : (
            <div className="flex items-center gap-x-3">
              {activeRole && <span className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">{activeRole}</span>}
              <button onClick={handleLogout} className="text-sm font-semibold text-gray-900 hover:text-gray-600">Log out</button>
            </div>
          )}
          {/* Mobile menu toggle */}
          <button className="lg:hidden -m-2.5 rounded-md p-2.5 text-gray-700" onClick={toggleMobileMenu}>
            <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 px-4 py-3 space-y-2">
          <Link to="/catalog" className="block py-2 text-base font-semibold text-gray-900">Katalog</Link>
          {token && <Link to={`/${activeRole}/dashboard`} className="block py-2 text-base font-semibold text-gray-900">Dashboard</Link>}
        </div>
      )}
    </header>
  );
}

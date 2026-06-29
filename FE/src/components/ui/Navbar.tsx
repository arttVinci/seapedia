import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLogout } from "../../hooks/mutations/auth/useLogout";
import { useNavigate } from "react-router-dom";
import {
  Anchor,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
} from "lucide-react";

export function Navbar() {
  const { token, activeRole } = useAuth();
  const logoutMutation = useLogout();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate("/"),
      onError: () => navigate("/"),
    });
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinks = [
    { name: "Beranda", path: "/" },
    { name: "Katalog", path: "/catalog" },
  ];

  return (
    <div className={`sticky top-0 z-50 w-full transition-[padding] duration-500 ease-in-out ${scrolled ? "px-4 pt-4 sm:px-6 lg:px-8" : "px-0 pt-0"}`}>
      <header
        className={`mx-auto w-full transition-all duration-500 ease-in-out ${
          scrolled
            ? "max-w-[88rem] bg-white/90 backdrop-blur-md shadow-lg rounded-2xl border border-gray-200/60 overflow-hidden"
            : "max-w-full bg-white border-b border-gray-100 rounded-none"
        }`}
      >
        <div 
          className={`mx-auto flex max-w-[85rem] items-center justify-between transition-all duration-500 ease-in-out ${
            scrolled ? "px-4 sm:px-6 py-2.5" : "px-4 sm:px-6 lg:px-8 py-4"
          }`}
        >
        {/* Logo + Brand name */}
        <Link to="/" className="flex items-center gap-x-2 group">
          <div className="bg-blue-600 p-2 rounded-lg text-white group-hover:bg-blue-700 transition-colors">
            <Anchor className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
            SEAPEDIA
          </span>
        </Link>

        {/* Nav links - Desktop */}
        <nav className="hidden lg:flex lg:gap-x-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-semibold transition-colors ${
                location.pathname === link.path
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
          {token && (
            <Link
              to={`/${activeRole}`}
              className={`text-sm font-semibold flex items-center gap-1 transition-colors ${
                location.pathname.startsWith(`/${activeRole}`)
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right side - auth buttons or user menu */}
        <div className="flex items-center gap-x-4">
          {!token ? (
            <div className="hidden lg:flex items-center gap-x-4">
              <Link
                to="/login"
                className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 hover:shadow-md transition-all active:scale-95"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-x-4">
              {activeRole === "buyer" && (
                <Link
                  to="/buyer/cart"
                  className="text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"
                >
                  <ShoppingBag className="h-5 w-5" />
                </Link>
              )}
              <div className="h-6 w-px bg-gray-200"></div>
              {activeRole && (
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/80 rounded-full border border-blue-200">
                  {activeRole}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Log out</span>
              </button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-4 lg:hidden">
            {token && activeRole === "buyer" && (
              <Link
                to="/buyer/cart"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ShoppingBag className="h-6 w-6" />
              </Link>
            )}
            <button
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden bg-white border-t border-gray-100 shadow-xl ${
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                location.pathname === link.path
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-900 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
          {token && (
            <Link
              to={`/${activeRole}`}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                location.pathname.startsWith(`/${activeRole}`)
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-900 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
          )}

          <div className="pt-4 mt-2 border-t border-gray-100">
            {!token ? (
              <div className="flex flex-col gap-2 px-3">
                <Link
                  to="/login"
                  className="w-full text-center px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between px-3">
                {activeRole && (
                  <span className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 rounded-full">
                    {activeRole}
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      </header>
    </div>
  );
}

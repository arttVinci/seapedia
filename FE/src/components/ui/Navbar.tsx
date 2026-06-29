import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLogout } from "../../hooks/mutations/auth/useLogout";
import { useRoles } from "../../hooks/queries/auth/useRoles";
import { authService } from "../../services";
import { OpenShopModal } from "../auth/OpenShopModal";
import {
  Anchor,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  ChevronDown,
  User,
  Settings,
  Store,
  Users,
  Search,
} from "lucide-react";

const roleDisplayNames: Record<string, string> = {
  buyer: "Pembeli",
  seller: "Penjual",
  driver: "Pengantar",
  admin: "Admin",
};

export function Navbar() {
  const { user, token, activeRole, handleSelectRoleSuccess } = useAuth();
  const logoutMutation = useLogout();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);

  const { data: rolesData } = useRoles();
  const availableRoles = rolesData?.roles || [];
  const hasSellerRole = availableRoles.includes("seller");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        roleDropdownRef.current &&
        !roleDropdownRef.current.contains(event.target as Node)
      ) {
        setRoleDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    setRoleDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate("/"),
      onError: () => navigate("/"),
    });
  };

  const handleSwitchRole = async (role: string) => {
    if (role === activeRole) return;
    try {
      setIsSwitchingRole(true);
      const resp = await authService.selectRole({ role: role as any });
      handleSelectRoleSuccess(resp.token, resp.active_role);
      setRoleDropdownOpen(false);
      setMobileMenuOpen(false);
    } catch (error) {
      console.error(`Failed to switch to ${role}`, error);
    } finally {
      setIsSwitchingRole(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const displayRole = activeRole
    ? roleDisplayNames[activeRole] || activeRole
    : "";

  return (
    <>
      <div
        className={`sticky top-0 z-50 w-full transition-[padding] duration-500 ease-in-out ${scrolled ? "px-4 pt-4 sm:px-6 lg:px-8" : "px-0 pt-0"}`}
      >
        <header
          className={`mx-auto w-full transition-all duration-500 ease-in-out ${
            scrolled
              ? "max-w-[88rem] bg-white/90 backdrop-blur-md shadow-lg rounded-2xl border border-gray-200/60"
              : "max-w-full bg-white border-b border-gray-100 rounded-none"
          }`}
        >
          <div
            className={`mx-auto flex max-w-[85rem] items-center justify-between transition-all duration-500 ease-in-out ${
              scrolled ? "px-4 sm:px-6 py-2.5" : "px-4 sm:px-6 lg:px-8 py-4"
            }`}
          >
            {/* Left side and Search: Logo, Kategori, Search */}
            <div className="flex items-center gap-x-4 lg:gap-x-6 flex-1 mr-4 lg:mr-8">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-x-2 group shrink-0">
                <div className="bg-blue-600 p-2 rounded-lg text-white group-hover:bg-blue-700 transition-colors">
                  <Anchor className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors hidden sm:block">
                  SEAPEDIA
                </span>
              </Link>

              {/* Kategori (disabled) */}
              <button disabled className="hidden lg:flex text-gray-500 hover:text-gray-500 font-medium cursor-not-allowed items-center text-sm shrink-0">
                Kategori
              </button>

              {/* Search Bar */}
              <div className="flex-1 hidden md:block max-w-3xl">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                     type="text"
                     disabled
                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm bg-gray-50 cursor-not-allowed"
                     placeholder="Cari di Seapedia..."
                  />
                </div>
              </div>
            </div>

            {/* Right side */}
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
                    <div className="flex items-center pr-4 border-r border-gray-200">
                      <Link
                        to="/buyer/cart"
                        className="text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"
                      >
                        <ShoppingBag className="h-5 w-5" />
                      </Link>
                    </div>
                  )}

                  {activeRole === "seller" && (
                    <div className="flex items-center pr-4 border-r border-gray-200">
                      <Link
                        to="/seller"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-semibold"
                      >
                        <Store className="h-4 w-4" />
                        Toko Saya
                      </Link>
                    </div>
                  )}

                  {/* Role Switcher or Buka Toko button */}
                  {activeRole && (
                    <div className="flex items-center">
                      {availableRoles.length > 1 ? (
                        <div className="relative" ref={roleDropdownRef}>
                          <button
                            onClick={() =>
                              setRoleDropdownOpen(!roleDropdownOpen)
                            }
                            disabled={isSwitchingRole}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-50 border border-gray-200 transition-all cursor-pointer text-sm font-medium text-gray-700"
                          >
                            <Users className="h-4 w-4" />
                            <span className="capitalize">
                              Peran: {displayRole}
                            </span>
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          </button>

                          {roleDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                              <div className="px-4 py-2 border-b border-gray-50 mb-2">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                  Switch Peran
                                </p>
                              </div>

                              {availableRoles.map((role) => (
                                <button
                                  key={role}
                                  onClick={() => handleSwitchRole(role)}
                                  className={`flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors ${role === activeRole ? "text-blue-700 bg-blue-50 font-semibold cursor-default" : "text-gray-700 hover:bg-gray-50 hover:text-blue-700"}`}
                                >
                                  {roleDisplayNames[role] || role}{" "}
                                  {role === activeRole && " (Aktif)"}
                                </button>
                              ))}

                              {!hasSellerRole && (
                                <div className="pt-2 mt-2 border-t border-gray-50">
                                  <button
                                    onClick={() => setIsShopModalOpen(true)}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                                  >
                                    <Store className="h-4 w-4" /> Buka Toko
                                    Gratis
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        // If only 1 role, don't show dropdown. Just show "Buka Toko Gratis" if seller is not one of them
                        !hasSellerRole &&
                        activeRole === "buyer" && (
                          <button
                            onClick={() => setIsShopModalOpen(true)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 border border-transparent transition-all cursor-pointer text-sm font-medium text-blue-700"
                          >
                            <Store className="h-4 w-4" />
                            Buka Toko Gratis
                          </button>
                        )
                      )}
                    </div>
                  )}

                  {activeRole && user && (
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all cursor-pointer"
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {user.username}
                        </span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </button>

                      {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="px-4 py-3 border-b border-gray-50 mb-2">
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-100 p-2 rounded-full">
                                <User className="h-5 w-5 text-blue-700" />
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-sm font-bold text-gray-900 truncate">
                                  {user.username}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </div>

                          {activeRole === "buyer" && (
                            <div className="py-1 border-b border-gray-50">
                              <Link
                                to="/buyer/orders"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                              >
                                Pembelian
                              </Link>
                              <Link
                                to="/buyer/wallet"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                              >
                                Dompet
                              </Link>
                              <Link
                                to="/buyer/addresses"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                              >
                                Alamat
                              </Link>
                            </div>
                          )}

                          <Link
                            to="/settings"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors mt-1"
                          >
                            <Settings className="h-4 w-4" />
                            Pengaturan
                          </Link>

                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1 border-t border-gray-50 pt-3"
                          >
                            <LogOut className="h-4 w-4" />
                            Keluar
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Mobile toggle */}
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

          {/* Mobile dropdown */}
          <div
            className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden bg-white border-t border-gray-100 shadow-xl ${
              mobileMenuOpen
                ? "max-h-[32rem] opacity-100 overflow-y-auto"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-4 py-4 space-y-2">
              <div className="relative w-full mb-4 md:hidden">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                   type="text"
                   disabled
                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm bg-gray-50 cursor-not-allowed"
                   placeholder="Cari di Seapedia..."
                />
              </div>

              <div className="pt-2 border-t border-gray-100">
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
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-3 pb-3 border-b border-gray-50">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-blue-700" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {user?.username}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    {availableRoles.length > 1 ? (
                      <div className="px-3 pb-2 border-b border-gray-50">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Switch Peran (Aktif: {displayRole})
                        </p>
                        <div className="flex flex-col gap-1">
                          {availableRoles.map((role) => (
                            <button
                              key={role}
                              onClick={() => handleSwitchRole(role)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${role === activeRole ? "text-blue-700 bg-blue-50 font-semibold" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"}`}
                            >
                              {roleDisplayNames[role] || role}{" "}
                              {role === activeRole && " (Aktif)"}
                            </button>
                          ))}
                          {!hasSellerRole && (
                            <button
                              onClick={() => setIsShopModalOpen(true)}
                              className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
                            >
                              <Store className="h-4 w-4" /> Buka Toko Gratis
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="px-3 pb-2 border-b border-gray-50">
                        {!hasSellerRole && activeRole === "buyer" && (
                          <button
                            onClick={() => setIsShopModalOpen(true)}
                            className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
                          >
                            <Store className="h-4 w-4" /> Buka Toko Gratis
                          </button>
                        )}
                      </div>
                    )}

                    {activeRole === "buyer" && (
                      <div className="space-y-1">
                        <Link
                          to="/buyer/orders"
                          className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          Pembelian
                        </Link>
                        <Link
                          to="/buyer/wallet"
                          className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          Dompet
                        </Link>
                        <Link
                          to="/buyer/addresses"
                          className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          Alamat
                        </Link>
                      </div>
                    )}

                    {activeRole === "seller" && (
                      <div className="space-y-1">
                        <Link
                          to="/seller"
                          className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          Dashboard Toko
                        </Link>
                      </div>
                    )}

                    <div className="pt-2 border-t border-gray-100">
                      <Link
                        to="/settings"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Settings className="h-5 w-5" />
                        Pengaturan
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-5 w-5" />
                        Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
      </div>

      {isShopModalOpen && (
        <OpenShopModal
          isOpen={isShopModalOpen}
          onClose={() => setIsShopModalOpen(false)}
        />
      )}
    </>
  );
}

import { Outlet } from "react-router-dom";
import { Sidebar } from "../ui";
import { useAuth } from "../../contexts/AuthContext";
import { useLogout } from "../../hooks/useAuthHooks";
import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { Button } from "../ui";

export function DashboardShell() {
  const { user, activeRole } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - hidden on mobile unless toggled */}
      <div className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-white lg:block">
        <Sidebar role={activeRole || "buyer"} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
          <h1 className="text-xl font-semibold text-gray-900">
            Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            {activeRole && (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                {activeRole.toUpperCase()}
              </span>
            )}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">
                {user?.name || "User"}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                <User size={18} />
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-500">
              <LogOut size={16} className="mr-1" />
              Logout
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

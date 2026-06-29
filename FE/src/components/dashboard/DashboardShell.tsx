import { Outlet } from "react-router-dom";
import { Sidebar } from "../ui";
import { useAuth } from "../../contexts/AuthContext";

export function DashboardShell() {
  const { activeRole } = useAuth();

  return (
    <div className="mx-auto w-full max-w-[85rem] px-4 py-8 sm:px-6 lg:px-8 relative z-10">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <div className="hidden w-64 flex-shrink-0 lg:block">
          <Sidebar role={activeRole || "buyer"} />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

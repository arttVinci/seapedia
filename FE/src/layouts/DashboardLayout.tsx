import { Outlet } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar";

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}

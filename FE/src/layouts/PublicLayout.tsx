import { Outlet } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar isLoggedIn={false} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

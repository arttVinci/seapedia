import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Package,
  ShoppingCart,
  Truck,
  Settings,
  Star,
  Store,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface SidebarProps {
  role: string;
}

export function Sidebar({ role }: SidebarProps) {
  const location = useLocation();

  const getRoleLinks = (userRole: string) => {
    switch (userRole) {
      case "buyer":
        return [
          { name: "Dashboard", href: "/buyer", icon: Home },
          { name: "Keranjang", href: "/buyer/cart", icon: ShoppingCart },
          { name: "Pesanan Saya", href: "/buyer/orders", icon: Package },
          { name: "Dompet", href: "/buyer/wallet", icon: Store },
          { name: "Alamat", href: "/buyer/addresses", icon: Home },
          {
            name: "Laporan Pengeluaran",
            href: "/buyer/reports/expense",
            icon: Star,
          },
        ];
      case "seller":
        return [
          { name: "Dashboard", href: "/seller", icon: Home },
          { name: "Toko Saya", href: "/seller/store", icon: Store },
          { name: "Produk Saya", href: "/seller/products", icon: Package },
          { name: "Pesanan", href: "/seller/orders", icon: ShoppingCart },
          {
            name: "Laporan Pendapatan",
            href: "/seller/reports/income",
            icon: Star,
          },
        ];
      case "driver":
        return [
          { name: "Dashboard", href: "/driver", icon: Home },
          { name: "Cari Pekerjaan", href: "/driver/jobs", icon: Truck },
          {
            name: "Pekerjaan Aktif",
            href: "/driver/active-job",
            icon: Package,
          },
        ];
      case "admin":
        return [
          { name: "Dashboard", href: "/admin", icon: Home },
          { name: "Vouchers", href: "/admin/vouchers", icon: Star },
          { name: "Promos", href: "/admin/promos", icon: Star },
        ];
      default:
        return [{ name: "Dashboard", href: "/dashboard", icon: Home }];
    }
  };

  const links = getRoleLinks(role);

  return (
    <div className="flex h-full flex-col overflow-y-auto border-r border-gray-200 bg-white px-3 py-4">
      <div className="mb-6 px-3">
        <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
      </div>
      <ul className="space-y-1">
        {links.map((link) => {
          const isActive = location.pathname === link.href;
          const Icon = link.icon;
          return (
            <li key={link.name}>
              <Link
                to={link.href}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <Icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    isActive
                      ? "text-blue-700"
                      : "text-gray-400 group-hover:text-gray-500",
                  )}
                  aria-hidden="true"
                />
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto pt-4">
        <Link
          to="/dashboard/settings"
          className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          <Settings className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
          Settings
        </Link>
      </div>
    </div>
  );
}

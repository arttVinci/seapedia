import { Link, useLocation } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  Truck,
  Store,
  User,
  Wallet,
  Activity,
  Tags,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface SidebarProps {
  role: string;
}

interface SidebarGroup {
  title: string;
  icon: React.ElementType;
  links: { name: string; href: string }[];
}

export function Sidebar({ role }: SidebarProps) {
  const location = useLocation();

  const getRoleGroups = (userRole: string): SidebarGroup[] => {
    switch (userRole) {
      case "seller":
        return [
          {
            title: "Toko Saya",
            icon: Store,
            links: [
              { name: "Dashboard Utama", href: "/seller" },
              { name: "Pengaturan Toko", href: "/seller/store" },
            ],
          },
          {
            title: "Produk",
            icon: Package,
            links: [{ name: "Daftar Produk", href: "/seller/products" }],
          },
          {
            title: "Pesanan",
            icon: ShoppingCart,
            links: [
              { name: "Pesanan Masuk", href: "/seller/orders" },
              { name: "Riwayat Pesanan", href: "/seller/orders/history" },
            ],
          },
          {
            title: "Keuangan",
            icon: Wallet,
            links: [
              { name: "Laporan Pendapatan", href: "/seller/reports/income" },
            ],
          },
        ];
      case "driver":
        return [
          {
            title: "Pekerjaan",
            icon: Truck,
            links: [
              { name: "Dashboard", href: "/driver" },
              { name: "Cari Pekerjaan", href: "/driver/jobs" },
              { name: "Pekerjaan Aktif", href: "/driver/active-job" },
            ],
          },
        ];
      case "admin":
        return [
          {
            title: "Manajemen",
            icon: Activity,
            links: [{ name: "Dashboard", href: "/admin" }],
          },
          {
            title: "Promosi",
            icon: Tags,
            links: [
              { name: "Vouchers", href: "/admin/vouchers" },
              { name: "Promos", href: "/admin/promos" },
            ],
          },
        ];
      default:
        // Fallback
        return [
          {
            title: "Akun Saya",
            icon: User,
            links: [{ name: "Pengaturan", href: "/settings" }],
          },
        ];
    }
  };

  const groups = getRoleGroups(role);

  return (
    <div className="flex flex-col rounded-2xl bg-white border border-gray-100 shadow-xl shadow-gray-200/40 p-5">
      <div className="space-y-8">
        {groups.map((group, index) => (
          <div key={index}>
            <div className="flex items-center gap-3 px-1 mb-4">
              <group.icon className="h-6 w-6 text-gray-900" strokeWidth={1.5} />
              <h3 className="text-base font-bold text-gray-900">
                {group.title}
              </h3>
            </div>
            <ul className="space-y-1">
              {group.links.map((link) => {
                const isExactActive = location.pathname === link.href;

                return (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className={cn(
                        "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isExactActive
                          ? "bg-blue-50 text-blue-700 font-semibold"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      )}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

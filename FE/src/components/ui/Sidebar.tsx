import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  Truck, 
  Settings,
  Star
} from "lucide-react";
import { cn } from "../../lib/utils";

interface SidebarProps {
  role: string;
}

export function Sidebar({ role }: SidebarProps) {
  const location = useLocation();

  const getRoleLinks = (userRole: string) => {
    const baseLinks = [{ name: "Dashboard", href: "/dashboard", icon: Home }];
    
    switch (userRole) {
      case "buyer":
        return [
          ...baseLinks,
          { name: "My Orders", href: "/dashboard/orders", icon: ShoppingCart },
          { name: "My Reviews", href: "/dashboard/reviews", icon: Star },
        ];
      case "seller":
        return [
          ...baseLinks,
          { name: "My Products", href: "/dashboard/products", icon: Package },
          { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
        ];
      case "driver":
        return [
          ...baseLinks,
          { name: "Deliveries", href: "/dashboard/deliveries", icon: Truck },
        ];
      case "admin":
        return [
          ...baseLinks,
          { name: "Users", href: "/dashboard/users", icon: Users },
          { name: "All Products", href: "/dashboard/products", icon: Package },
        ];
      default:
        return baseLinks;
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
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    isActive
                      ? "text-blue-700"
                      : "text-gray-400 group-hover:text-gray-500"
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

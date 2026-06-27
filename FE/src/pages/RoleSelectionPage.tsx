import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSelectRole } from "../../hooks/useSelectRole";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from "../ui";
import { Store, ShoppingBag, Truck, ShieldCheck } from "lucide-react";

export function RoleSelectionPage() {
  const { user } = useAuth();
  const { selectRole } = useSelectRole();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const handleRoleSelect = (role: string) => {
    selectRole(role);
    navigate(`/${role}`);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "buyer": return <ShoppingBag className="h-6 w-6" />;
      case "seller": return <Store className="h-6 w-6" />;
      case "driver": return <Truck className="h-6 w-6" />;
      case "admin": return <ShieldCheck className="h-6 w-6" />;
      default: return null;
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "buyer": return "Mulai berbelanja hasil laut segar.";
      case "seller": return "Kelola toko dan produk Anda.";
      case "driver": return "Lihat dan ambil pesanan untuk diantar.";
      case "admin": return "Masuk ke panel administrasi sistem.";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          Pilih Peran Anda
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Akun Anda memiliki akses ke beberapa peran. Silakan pilih salah satu untuk melanjutkan.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-3xl px-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {user.roles.map((role) => (
            <Card 
              key={role} 
              className="cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
              onClick={() => handleRoleSelect(role)}
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    {getRoleIcon(role)}
                  </div>
                  <div>
                    <CardTitle className="capitalize">{role}</CardTitle>
                    <CardDescription>{getRoleDescription(role)}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Masuk sebagai {role}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "../hooks/mutations/auth/useRegister";
import { useAuth } from "../contexts/AuthContext";
import { authService, storeService } from "../services";
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui";

export function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Roles
  const [isSeller, setIsSeller] = useState(false);
  const [isDriver, setIsDriver] = useState(false);
  
  // Store details
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const registerMutation = useRegister();
  const navigate = useNavigate();
  const { handleLoginSuccess, handleSelectRoleSuccess } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isSeller && (!storeName || !storeDescription)) {
      setError("Nama toko dan deskripsi wajib diisi untuk Seller.");
      return;
    }

    setIsLoading(true);

    registerMutation.mutate(
      { username, email, password, role: "buyer" },
      {
        onSuccess: async () => {
          try {
            const authResp = await authService.login({ email, password });
            handleLoginSuccess(authResp.token);

            if (isSeller) {
              await authService.addRole({ role: "seller" });
              const selectResp = await authService.selectRole({ role: "seller" });
              
              // Update token for store creation
              handleSelectRoleSuccess(selectResp.token, selectResp.active_role);
              
              await storeService.createStore({
                name: storeName,
                description: storeDescription,
              });
            }

            if (isDriver) {
              await authService.addRole({ role: "driver" });
            }

            // Default fallback role to buyer
            const selectBuyerResp = await authService.selectRole({ role: "buyer" });
            handleSelectRoleSuccess(selectBuyerResp.token, selectBuyerResp.active_role);
            
            navigate("/");
          } catch (err: any) {
            console.error(err);
            setError("Akun berhasil dibuat, namun gagal mengatur peran/toko. Silakan atur di pengaturan.");
            setTimeout(() => navigate("/"), 2000);
          } finally {
            setIsLoading(false);
          }
        },
        onError: () => {
          setError("Registrasi gagal. Silakan coba lagi.");
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <div className="flex min-h-[calc(100vh-130px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold">
            Buat Akun Baru
          </CardTitle>
          <CardDescription className="text-center">
            Isi form di bawah ini untuk mendaftar ke Seapedia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Input
                label="Username"
                type="text"
                placeholder="johndoe"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-3 pt-2">
              <label className="text-sm font-medium text-gray-700">Pilih Peran Anda</label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-not-allowed opacity-70">
                  <input type="checkbox" checked disabled className="rounded text-blue-600 w-4 h-4" />
                  <span className="text-sm text-gray-700">Buyer (Pembeli)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isSeller} 
                    onChange={(e) => setIsSeller(e.target.checked)}
                    className="rounded text-blue-600 w-4 h-4 focus:ring-blue-500" 
                  />
                  <span className="text-sm text-gray-700">Seller (Penjual)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isDriver} 
                    onChange={(e) => setIsDriver(e.target.checked)}
                    className="rounded text-blue-600 w-4 h-4 focus:ring-blue-500" 
                  />
                  <span className="text-sm text-gray-700">Driver (Pengantar)</span>
                </label>
              </div>
            </div>

            {isSeller && (
              <div className="space-y-4 p-4 mt-2 bg-gray-50 border border-gray-100 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
                <h4 className="text-sm font-semibold text-gray-700">Informasi Toko</h4>
                <div className="space-y-2">
                  <Input
                    label="Nama Toko"
                    type="text"
                    placeholder="Toko Maju Jaya"
                    required={isSeller}
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    label="Deskripsi Toko"
                    type="text"
                    placeholder="Menjual berbagai kebutuhan laut"
                    required={isSeller}
                    value={storeDescription}
                    onChange={(e) => setStoreDescription(e.target.value)}
                  />
                </div>
              </div>
            )}

            <Button
              className="w-full mt-4"
              type="submit"
              isLoading={registerMutation.isPending || isLoading}
            >
              Daftar
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Sudah punya akun? </span>
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Log in di sini
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

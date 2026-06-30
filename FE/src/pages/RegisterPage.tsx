import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "../hooks/mutations/auth/useRegister";
import { useAddRole } from "../hooks/mutations/auth/useAddRole";
import { useSelectRole } from "../hooks/mutations/auth/useSelectRole";
import { useLogin } from "../hooks/mutations/auth/useLogin";
import { useCreateStore } from "../hooks/mutations/stores/useCreateStore";
import {
  Mail,
  Lock,
  User,
  Store,
  Truck,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button, Input } from "../components/ui";

import { useQueryClient } from "@tanstack/react-query";

export function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const queryClient = useQueryClient();

  // Roles
  const [isSeller, setIsSeller] = useState(false);
  const [isDriver, setIsDriver] = useState(false);

  // Store details
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const registerMutation = useRegister();
  const loginMutation = useLogin();
  const addRoleMutation = useAddRole();
  const selectRoleMutation = useSelectRole();
  const createStoreMutation = useCreateStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

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
            await loginMutation.mutateAsync({ email, password });

            if (isSeller) {
              await addRoleMutation.mutateAsync({ role: "seller" });
              await selectRoleMutation.mutateAsync({ role: "seller" });
              await createStoreMutation.mutateAsync({
                name: storeName,
                description: storeDescription,
              });
            }

            if (isDriver) {
              await addRoleMutation.mutateAsync({ role: "driver" });
            }

            // Default fallback role to buyer
            await selectRoleMutation.mutateAsync({ role: "buyer" });

            await queryClient.invalidateQueries({ queryKey: ["roles"] });
            navigate("/");
          } catch (err: any) {
            console.error(err);
            setError(
              "Akun berhasil dibuat, namun gagal mengatur peran/toko. Silakan atur di pengaturan.",
            );
            setTimeout(() => navigate("/"), 2000);
          } finally {
            setIsLoading(false);
          }
        },
        onError: (err: any) => {
          const errMsg =
            err?.response?.data?.message ||
            "Registrasi gagal. Silakan coba lagi.";
          setError(errMsg);
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side: branding/illustration */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 p-12 flex-col justify-between relative overflow-hidden fixed h-screen">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-400 opacity-20 rounded-full translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 flex items-center gap-3">
          <img
            src="/image/logo.webp"
            alt="Seapedia Logo"
            className="h-12 w-12 object-contain rounded-lg"
          />
          <span className="text-2xl font-bold text-white tracking-tight">
            SEAPEDIA
          </span>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Mulai Perjalanan Anda.
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Bergabunglah dengan ekosistem terbesar. Baik sebagai pembeli,
            penjual, maupun kurir pengantar.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-blue-200 text-sm">
          <span>© 2026 Compfest. All rights reserved.</span>
        </div>
      </div>

      {/* Right side: form (Offset margin to account for fixed left side on desktop if needed, here we use flex) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-16 bg-white relative ml-auto">
        {/* Mobile Header (only visible on small screens) */}
        <div className="absolute top-6 left-6 flex items-center gap-2 lg:hidden">
          <img
            src="/image/logo.webp"
            alt="Seapedia Logo"
            className="h-8 w-8 object-contain rounded-md"
          />
          <span className="text-base font-bold text-gray-900">SEAPEDIA</span>
        </div>

        <div className="w-full max-w-lg space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out mt-8 lg:mt-0">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Buat Akun Baru
            </h2>
            <p className="text-sm text-gray-500">
              Lengkapi data diri Anda di bawah ini untuk memulai.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                <div className="p-1 bg-red-100 rounded-full mt-0.5">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                </div>
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <User className="h-4 w-4" />
                </div>
                <Input
                  type="text"
                  placeholder="Name"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-9 h-11 text-sm bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all rounded-xl"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-11 text-sm bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-9 h-11 text-sm bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-9 pr-9 h-11 text-sm bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <label className="text-sm font-semibold text-gray-900">
                Peran Anda
              </label>
              <div className="grid grid-cols-3 gap-3">
                <label className="flex items-center gap-2 p-2 rounded-xl border border-gray-100 bg-gray-50 cursor-not-allowed opacity-70">
                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="rounded text-blue-600 w-3 h-3"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-900">
                      Buyer
                    </span>
                    <span className="text-[10px] text-gray-500 leading-tight">
                      Peran default
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-2 p-2 rounded-xl border transition-all cursor-pointer ${isSeller ? "border-blue-500 bg-blue-50/50" : "border-gray-200 hover:border-blue-300"}`}
                >
                  <input
                    type="checkbox"
                    checked={isSeller}
                    onChange={(e) => setIsSeller(e.target.checked)}
                    className="rounded text-blue-600 w-3 h-3 focus:ring-blue-500"
                  />
                  <Store
                    className={`w-4 h-4 ${isSeller ? "text-blue-600" : "text-gray-400"}`}
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-900">
                      Seller
                    </span>
                    <span className="text-[10px] text-gray-500 leading-tight">
                      Buka toko
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-2 p-2 rounded-xl border transition-all cursor-pointer ${isDriver ? "border-blue-500 bg-blue-50/50" : "border-gray-200 hover:border-blue-300"}`}
                >
                  <input
                    type="checkbox"
                    checked={isDriver}
                    onChange={(e) => setIsDriver(e.target.checked)}
                    className="rounded text-blue-600 w-3 h-3 focus:ring-blue-500"
                  />
                  <Truck
                    className={`w-4 h-4 ${isDriver ? "text-blue-600" : "text-gray-400"}`}
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-900">
                      Driver
                    </span>
                    <span className="text-[10px] text-gray-500 leading-tight">
                      Kirim kurir
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {isSeller && (
              <div className="space-y-3 p-4 mt-2 bg-gray-50 border border-gray-200 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <Store className="w-4 h-4 text-blue-600" />
                  <h4 className="text-sm font-semibold text-gray-900">
                    Detail Toko Anda
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Nama Toko (ex. Maju Jaya)"
                    required={isSeller}
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="h-11 text-sm bg-white border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all rounded-lg"
                  />
                  <textarea
                    placeholder="Deskripsi singkat toko..."
                    required={isSeller}
                    value={storeDescription}
                    onChange={(e) => setStoreDescription(e.target.value)}
                    className="w-full p-2 h-11 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                  />
                </div>
              </div>
            )}

            <Button
              className="w-full h-11 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group mt-4"
              type="submit"
              isLoading={registerMutation.isPending || isLoading}
            >
              {!(registerMutation.isPending || isLoading) && (
                <>
                  Daftar Sekarang
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="pt-4 border-t border-gray-100 text-center">
            <p className="text-gray-600">
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Log in di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

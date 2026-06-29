import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/mutations/auth/useLogin";
import { Anchor, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button, Input } from "../components/ui";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const loginMutation = useLogin();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate("/select-role", { state: { fromLogin: true } });
        },
        onError: (err: any) => {
          const errMsg =
            err?.response?.data?.message ||
            "Email atau password yang Anda masukkan salah.";
          setError(errMsg);
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side: branding/illustration */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative background circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-400 opacity-20 rounded-full translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Anchor className="h-8 w-8 text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">
            SEAPEDIA
          </span>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Kembali ke lautan peluang.
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Masuk ke akun Anda untuk mengelola, memantau pesanan
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-blue-200 text-sm">
          <span>© 2026 Compfest. All rights reserved.</span>
        </div>
      </div>

      {/* Right side: form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
        {/* Mobile Header (only visible on small screens) */}
        <div className="absolute top-8 left-8 flex items-center gap-2 lg:hidden">
          <div className="p-1.5 bg-blue-600 rounded-md">
            <Anchor className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">SEAPEDIA</span>
        </div>

        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Selamat Datang
            </h2>
            <p className="text-gray-500">
              Masukkan kredensial Anda untuk melanjutkan ke dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                <div className="p-1 bg-red-100 rounded-full mt-0.5">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                </div>
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all rounded-xl"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              className="w-full h-12 text-base font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
              type="submit"
              isLoading={loginMutation.isPending}
            >
              {!loginMutation.isPending && (
                <>
                  Log In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-600">
              Belum menjadi bagian dari kami?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Buat Akun Baru
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/mutations/auth/useLogin";
import { Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const loginMutation = useLogin();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    loginMutation.mutate(
      { username, password },
      {
        onSuccess: () => {
          // Arahkan ke halaman select role setelah berhasil login
          navigate("/select-role");
        },
        onError: () => {
          setError("Login gagal. Periksa kembali username dan password Anda.");
        },
      }
    );
  };

  return (
    <div className="flex min-h-[calc(100vh-130px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold">Log in ke akun Anda</CardTitle>
          <CardDescription className="text-center">
            Masukkan username Anda di bawah ini untuk masuk ke akun Anda
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
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              type="submit"
              isLoading={loginMutation.isPending}
            >
              Log In
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Belum punya akun? </span>
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Daftar sekarang
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

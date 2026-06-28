import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "../hooks/mutations/auth/useRegister";
import { Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui";

export function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const registerMutation = useRegister();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    registerMutation.mutate(
      { username, email, password },
      {
        onSuccess: () => {
          navigate("/select-role");
        },
        onError: () => {
          setError("Registrasi gagal. Silakan coba lagi.");
        },
      }
    );
  };

  return (
    <div className="flex min-h-[calc(100vh-130px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold">Buat Akun Baru</CardTitle>
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
            <Button
              className="w-full"
              type="submit"
              isLoading={registerMutation.isPending}
            >
              Daftar
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Sudah punya akun? </span>
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Log in di sini
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

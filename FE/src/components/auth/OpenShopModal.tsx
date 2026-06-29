import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, storeService } from "../../services";
import { useAuth } from "../../contexts/AuthContext";
import { X } from "lucide-react";
import { Button, Input } from "../ui";

interface OpenShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OpenShopModal({ isOpen, onClose }: OpenShopModalProps) {
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { handleSelectRoleSuccess } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || !storeDescription) {
      setError("Semua field wajib diisi.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // 1. Add seller role
      await authService.addRole({ role: "seller" });
      
      // 2. Select seller role
      const selectResp = await authService.selectRole({ role: "seller" });
      handleSelectRoleSuccess(selectResp.token, selectResp.active_role);
      
      // 3. Create store
      await storeService.createStore({
        name: storeName,
        description: storeDescription,
      });

      // 4. Close modal and navigate
      onClose();
      navigate("/seller");
    } catch (err: any) {
      console.error(err);
      setError("Gagal membuat toko. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Buka Toko Gratis</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Isi detail toko Anda di bawah ini untuk mulai berjualan.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Input
              label="Nama Toko"
              placeholder="Contoh: Seapedia Store"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Input
              label="Deskripsi Toko"
              placeholder="Jual ikan segar setiap hari"
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              required
            />
          </div>

          <div className="pt-4 flex gap-3">
            <Button type="button" variant="outline" className="w-full" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Buka Toko
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

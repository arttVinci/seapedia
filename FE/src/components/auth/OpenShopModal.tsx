import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Button, Input } from "../ui";

import { useQueryClient } from "@tanstack/react-query";

import { useAddRole } from "../../hooks/mutations/auth/useAddRole";
import { useSelectRole } from "../../hooks/mutations/auth/useSelectRole";
import { useCreateStore } from "../../hooks/mutations/stores/useCreateStore";

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
  const queryClient = useQueryClient();

  const addRoleMutation = useAddRole();
  const selectRoleMutation = useSelectRole();
  const createStoreMutation = useCreateStore();

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
      // 1. Add seller role (ignore if already owned)
      try {
        await addRoleMutation.mutateAsync({ role: "seller" });
      } catch (err: any) {
        if (err?.response?.status !== 409) {
          throw err;
        }
      }
      
      // 2. Select seller role
      await selectRoleMutation.mutateAsync({ role: "seller" });
      
      // 3. Create store
      await createStoreMutation.mutateAsync({
        name: storeName,
        description: storeDescription,
      });

      // 4. Invalidate cache and close modal
      await queryClient.invalidateQueries({ queryKey: ["roles"] });
      onClose();
      navigate("/seller");
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || "Gagal membuat toko. Silakan coba lagi.";
      setError(errMsg);
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
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" className="flex-1" isLoading={isLoading}>
              Buka Toko
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

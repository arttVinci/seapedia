import React, { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAddresses } from "../../hooks/queries/buyer/useAddresses";
import { useCreateAddress } from "../../hooks/mutations/buyer/useCreateAddress";
import { useUpdateAddress } from "../../hooks/mutations/buyer/useUpdateAddress";
import { useDeleteAddress } from "../../hooks/mutations/buyer/useDeleteAddress";
import type { Address } from "../../@types/models";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { MapPin, Plus, X, Edit2, Trash2, Home, Briefcase, Map } from "lucide-react";

const AddressPage: React.FC = () => {
  const { data: addresses, isLoading, isError } = useAddresses();
  const { mutate: createAddress, isPending: isCreating } = useCreateAddress();
  const { mutate: updateAddress, isPending: isUpdating } = useUpdateAddress();
  const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddress();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; addressId: string | null }>({ isOpen: false, addressId: null });

  const [formData, setFormData] = useState({
    label: "",
    recipient: "",
    phone: "",
    full_address: "",
  });

  const handleOpenModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        label: address.label,
        recipient: address.recipient,
        phone: address.phone,
        full_address: address.full_address,
      });
    } else {
      setEditingAddress(null);
      setFormData({
        label: "",
        recipient: "",
        phone: "",
        full_address: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddress) {
      updateAddress(
        { id: editingAddress.id, payload: formData },
        {
          onSuccess: () => {
            handleCloseModal();
          },
        }
      );
    } else {
      createAddress(formData, {
        onSuccess: () => {
          handleCloseModal();
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteAddress(id);
  };

  const getLabelIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("rumah")) return <Home className="w-4 h-4" />;
    if (l.includes("kantor") || l.includes("kerja")) return <Briefcase className="w-4 h-4" />;
    return <MapPin className="w-4 h-4" />;
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  if (isError) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
      <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
        <X className="w-8 h-8" />
      </div>
      <h2 className="text-lg font-bold text-gray-900 mb-2">Gagal Memuat Alamat</h2>
      <p className="text-gray-500">Terjadi kesalahan saat memuat daftar alamat Anda.</p>
    </div>
  );

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buku Alamat</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola alamat pengiriman untuk pesanan Anda</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2 rounded-full px-6">
          <Plus className="w-4 h-4" />
          Tambah Alamat Baru
        </Button>
      </div>

      {/* Empty State */}
      {(!addresses || addresses.length === 0) ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
            <Map className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Alamat</h2>
          <p className="text-gray-500 mb-6 max-w-md">
            Anda belum menambahkan alamat pengiriman. Tambahkan alamat sekarang untuk mempermudah proses checkout.
          </p>
          <Button onClick={() => handleOpenModal()} className="flex items-center gap-2 rounded-full">
            <Plus className="w-4 h-4" />
            Tambah Alamat
          </Button>
        </div>
      ) : (
        /* Address List */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {addresses.map((address) => (
            <div 
              key={address.id} 
              className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col hover:border-blue-500 hover:shadow-md transition-all duration-200 relative group"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                  {getLabelIcon(address.label)}
                </div>
                <h3 className="font-bold text-gray-900 line-clamp-1">{address.label}</h3>
              </div>
              
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Penerima</p>
                  <p className="font-semibold text-gray-900">{address.recipient}</p>
                  <p className="text-sm text-gray-600">{address.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Alamat</p>
                  <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                    {address.full_address}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-gray-700 bg-gray-50 hover:bg-gray-100 border-transparent hover:border-gray-200"
                  onClick={() => handleOpenModal(address)}
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                  Ubah
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-red-600 bg-red-50 hover:bg-red-100 border-transparent hover:border-red-200"
                  onClick={() => setDeleteConfirm({ isOpen: true, addressId: address.id })}
                  disabled={isDeleting}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Hapus
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={handleCloseModal}
          ></div>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                {editingAddress ? "Ubah Alamat" : "Tambah Alamat Baru"}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
              <div className="space-y-5">
                <Input
                  name="label"
                  label="Label Alamat"
                  value={formData.label}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: Rumah, Kantor, Apartemen"
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    name="recipient"
                    label="Nama Penerima"
                    value={formData.recipient}
                    onChange={handleChange}
                    required
                    placeholder="Nama Lengkap"
                  />
                  <Input
                    name="phone"
                    label="Nomor Telepon"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    type="tel"
                    placeholder="08123456789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Alamat Lengkap
                  </label>
                  <textarea
                    name="full_address"
                    value={formData.full_address}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-none"
                    placeholder="Tuliskan nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota, dan kode pos secara lengkap"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="rounded-full px-6"
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="rounded-full px-8"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                      Menyimpan...
                    </span>
                  ) : "Simpan Alamat"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, addressId: null })}
        onConfirm={() => {
          if (deleteConfirm.addressId) handleDelete(deleteConfirm.addressId);
        }}
        title="Hapus Alamat"
        message="Apakah Anda yakin ingin menghapus alamat ini? Data yang sudah dihapus tidak dapat dikembalikan."
        confirmText="Ya, Hapus"
      />
    </div>
  );
};

export default AddressPage;

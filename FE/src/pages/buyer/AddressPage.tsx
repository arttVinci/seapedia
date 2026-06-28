import React, { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAddresses } from "../../hooks/queries/buyer/useAddresses";
import { useCreateAddress } from "../../hooks/mutations/buyer/useCreateAddress";
import { useUpdateAddress } from "../../hooks/mutations/buyer/useUpdateAddress";
import { useDeleteAddress } from "../../hooks/mutations/buyer/useDeleteAddress";
import type { Address } from "../../@types/models";

const AddressPage: React.FC = () => {
  const { data: addresses, isLoading, isError } = useAddresses();
  const { mutate: createAddress, isPending: isCreating } = useCreateAddress();
  const { mutate: updateAddress, isPending: isUpdating } = useUpdateAddress();
  const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddress();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

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
    if (window.confirm("Apakah Anda yakin ingin menghapus alamat ini?")) {
      deleteAddress(id);
    }
  };

  if (isLoading) return <div className="p-4">Loading addresses...</div>;
  if (isError) return <div className="p-4 text-red-500">Failed to load addresses.</div>;

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Buku Alamat</h1>
        <Button onClick={() => handleOpenModal()}>Tambah Alamat</Button>
      </div>

      {(!addresses || addresses.length === 0) ? (
        <p className="text-gray-500">Belum ada alamat yang tersimpan.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id} className="p-4 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg mb-1">{address.label}</h3>
                <p className="font-semibold">{address.recipient}</p>
                <p className="text-sm text-gray-600">{address.phone}</p>
                <p className="text-sm text-gray-700 mt-2 line-clamp-3">
                  {address.full_address}
                </p>
              </div>
              <div className="flex space-x-3 mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenModal(address)}
                >
                  Ubah
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                  onClick={() => handleDelete(address.id)}
                  disabled={isDeleting}
                >
                  Hapus
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingAddress ? "Ubah Alamat" : "Tambah Alamat Baru"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="label"
                label="Label Alamat (Contoh: Rumah, Kantor)"
                value={formData.label}
                onChange={handleChange}
                required
                placeholder="Rumah"
              />
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Lengkap
                </label>
                <textarea
                  name="full_address"
                  value={formData.full_address}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Jalan, RT/RW, Kecamatan, Kota, Kode Pos"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressPage;

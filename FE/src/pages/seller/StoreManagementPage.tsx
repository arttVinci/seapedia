import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSellerStore } from '../../hooks/useSellerStore';
import { useCreateStore } from '../../hooks/useCreateStore';
import { useUpdateStore } from '../../hooks/useUpdateStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function StoreManagementPage() {
  const { user } = useAuth();
  const userId = String(user?.id || '');
  
  const { data: store, isLoading, isError, error } = useSellerStore();
  const createStoreMutation = useCreateStore(userId);
  const updateStoreMutation = useUpdateStore(userId);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Sync edit form with existing store data
  useEffect(() => {
    if (store && !isEditing) {
      setFormData({
        name: store.name,
        description: store.description || '',
      });
    }
  }, [store, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    try {
      await createStoreMutation.mutateAsync(formData);
      setSuccessMessage('Toko berhasil dibuat!');
      setFormData({ name: '', description: '' });
    } catch (err: any) {
      // Error is handled in the UI
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    try {
      await updateStoreMutation.mutateAsync(formData);
      setSuccessMessage('Data toko berhasil diperbarui!');
      setIsEditing(false);
    } catch (err: any) {
      // Error is handled in the UI
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 bg-red-50 p-4 rounded-md">
        Terjadi kesalahan saat memuat data toko: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Toko</h1>
        <p className="text-sm text-gray-500">Kelola informasi toko Anda di sini.</p>
      </div>

      {successMessage && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md">
          {successMessage}
        </div>
      )}

      {!store ? (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Buat Toko Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Nama Toko</label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: Toko Bahari Jaya"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Deskripsi</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ceritakan tentang toko Anda..."
                />
              </div>

              {createStoreMutation.isError && (
                <div className="text-sm text-red-500">
                  {createStoreMutation.error instanceof Error ? createStoreMutation.error.message : 'Gagal membuat toko'}
                </div>
              )}

              <Button type="submit" disabled={createStoreMutation.isPending} className="w-full sm:w-auto">
                {createStoreMutation.isPending ? 'Menyimpan...' : 'Buat Toko'}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Toko</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="block text-sm font-medium text-gray-500">Nama Toko</span>
                <span className="block mt-1 text-lg text-gray-900">{store.name}</span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">Deskripsi</span>
                <span className="block mt-1 text-gray-900 whitespace-pre-wrap">
                  {store.description || '-'}
                </span>
              </div>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  Edit Toko
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Edit Form Card */}
          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>Edit Toko</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="edit-name" className="text-sm font-medium">Nama Toko</label>
                    <Input
                      id="edit-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="edit-description" className="text-sm font-medium">Deskripsi</label>
                    <textarea
                      id="edit-description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {updateStoreMutation.isError && (
                    <div className="text-sm text-red-500">
                      {updateStoreMutation.error instanceof Error ? updateStoreMutation.error.message : 'Gagal memperbarui toko'}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button type="submit" disabled={updateStoreMutation.isPending}>
                      {updateStoreMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({ name: store.name, description: store.description || '' });
                      }}
                    >
                      Batal
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useSellerProducts } from '../../hooks/queries/products/useSellerProducts';
import { useCreateProduct } from '../../hooks/mutations/products/useCreateProduct';
import { useUpdateProduct } from '../../hooks/mutations/products/useUpdateProduct';
import { useDeleteProduct } from '../../hooks/mutations/products/useDeleteProduct';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { CreateProductPayload, UpdateProductPayload } from '../../@types/models';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  image_url: string;
}

function emptyForm(): ProductFormData {
  return {
    name: '',
    description: '',
    price: '',
    stock: '',
    image_url: '',
  };
}

export function ProductManagementPage() {
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const limit = 8;

  const { data, isLoading, isError, error } = useSellerProducts({ page, size: limit, title: search || undefined });
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm());
  const [formError, setFormError] = useState('');

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  const openCreate = () => {
    setEditingProductId(null);
    setForm(emptyForm());
    setFormError('');
    setIsModalOpen(true);
  };

  const openEdit = (product: any) => {
    setEditingProductId(product.id);
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      stock: String(product.stock),
      image_url: product.image_url || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProductId(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!form.name || !form.price || !form.stock) {
      setFormError('Nama, harga, dan stok wajib diisi.');
      return;
    }

    const price = parseFloat(form.price);
    const stock = parseInt(form.stock, 10);

    if (isNaN(price) || price <= 0) {
      setFormError('Harga harus berupa angka positif.');
      return;
    }
    if (isNaN(stock) || stock < 0) {
      setFormError('Stok harus berupa angka >= 0.');
      return;
    }

    try {
      if (editingProductId) {
        const payload: UpdateProductPayload = {
          name: form.name,
          description: form.description,
          price,
          stock,
          image_url: form.image_url,
        };
        await updateMutation.mutateAsync({ id: editingProductId, payload });
      } else {
        const payload: CreateProductPayload = {
          name: form.name,
          description: form.description,
          price,
          stock,
          image_url: form.image_url,
        };
        await createMutation.mutateAsync(payload);
      }
      closeModal();
    } catch (err: any) {
      setFormError(err instanceof Error ? err.message : 'Gagal menyimpan produk.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err: any) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus produk.');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Produk</h1>
          <p className="text-sm text-gray-500">Kelola produk toko Anda.</p>
        </div>
        <Button onClick={openCreate}>Tambah Produk</Button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md">
        <Input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button type="submit" variant="secondary">Cari</Button>
      </form>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 w-full animate-pulse rounded-md bg-gray-200" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-red-500 bg-red-50 p-4 rounded-md">
          {(error as Error)?.message || 'Gagal memuat data produk.'}
        </div>
      ) : !data || data.data.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">
              {search
                ? 'Tidak ada produk yang cocok dengan pencarian Anda.'
                : 'Belum ada produk. Tambah produk pertama Anda.'}
            </p>
            {!search && <Button onClick={openCreate}>Tambah Produk</Button>}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Produk
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Harga
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stok
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.data.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      Rp{product.price.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{product.stock}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEdit(product)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(product.id)}
                          disabled={deleteMutation.isPending}
                          className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Sebelumnya
              </Button>
              <span className="text-sm text-gray-500">
                Halaman {page} dari {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Selanjutnya
              </Button>
            </div>
          )}
        </>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingProductId ? 'Edit Produk' : 'Tambah Produk'}
            </h2>

            {formError && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Nama</label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Harga</label>
                  <Input
                    name="price"
                    type="number"
                    min="0"
                    step="1"
                    value={form.price}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stok</label>
                  <Input
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL Gambar</label>
                <Input
                  name="image_url"
                  value={form.image_url}
                  onChange={handleFormChange}
                  placeholder="https://..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Menyimpan...'
                    : editingProductId
                    ? 'Simpan'
                    : 'Tambah'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

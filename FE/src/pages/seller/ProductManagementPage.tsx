import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSellerProducts } from "../../hooks/queries/products/useSellerProducts";
import { useCreateProduct } from "../../hooks/mutations/products/useCreateProduct";
import { useUpdateProduct } from "../../hooks/mutations/products/useUpdateProduct";
import { useDeleteProduct } from "../../hooks/mutations/products/useDeleteProduct";
import { useUploadProductImage } from "../../hooks/mutations/products/useUploadProductImage";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { X, Search, Upload } from "lucide-react";
import { CategoryInput } from "../../components/ui/CategoryInput";
import type { CreateProductPayload } from "../../@types/models";

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  image_url: string;
  categories: string[];
}

function emptyForm(): ProductFormData {
  return {
    name: "",
    description: "",
    price: "",
    stock: "",
    image_url: "",
    categories: [],
  };
}

export function ProductManagementPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 8;
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    productId: string | null;
  }>({ isOpen: false, productId: null });

  const { data, isLoading, isError, error } = useSellerProducts({
    page,
    size: limit,
    name: search || undefined,
  });
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const uploadMutation = useUploadProductImage();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm());
  const [formError, setFormError] = useState("");

  const totalPages = data
    ? Math.max(1, (data as any).total_page || 1, Math.ceil(data.total / limit))
    : 1;

  const openCreate = () => {
    setEditingProductId(null);
    setForm(emptyForm());
    setFormError("");
    setIsModalOpen(true);
  };

  const openEdit = (product: any) => {
    setEditingProductId(product.id);
    setForm({
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      stock: String(product.stock),
      image_url: product.image_url || "",
      categories: product.categories || [],
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProductId(null);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);
      if (editingProductId) {
        formData.append("id", editingProductId);
      }

      const url = await uploadMutation.mutateAsync(formData);

      setForm((prev) => ({ ...prev, image_url: url }));
      toast.success("Gambar berhasil diunggah");
    } catch (err: any) {
      toast.error(
        err instanceof Error ? err.message : "Gagal mengunggah gambar",
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!form.name || !form.price || !form.stock) {
      setFormError("Nama, harga, dan stok wajib diisi.");
      return;
    }

    const price = parseFloat(form.price);
    const stock = parseInt(form.stock, 10);

    if (isNaN(price) || price <= 0) {
      setFormError("Harga harus berupa angka positif.");
      return;
    }
    if (isNaN(stock) || stock < 0) {
      setFormError("Stok harus berupa angka >= 0.");
      return;
    }

    try {
      const payload: CreateProductPayload = {
        name: form.name,
        description: form.description,
        price,
        stock,
        image_url: form.image_url,
        categories: form.categories,
      };

      if (editingProductId) {
        await updateMutation.mutateAsync({ id: editingProductId, payload });
        toast.success("Produk berhasil diperbarui!");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Produk berhasil ditambahkan!");
        // Reset pencarian dan halaman ke awal agar produk baru langsung terlihat
        setSearch("");
        setPage(1);
      }
      closeModal();
    } catch (err: any) {
      setFormError(
        err instanceof Error ? err.message : "Gagal menyimpan produk.",
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Produk berhasil dihapus!");
    } catch (err: any) {
      toast.error(
        err instanceof Error ? err.message : "Gagal menghapus produk.",
      );
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
        <Button onClick={openCreate} className="shadow-sm hover:shadow">
          Tambah Produk
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col sm:flex-row gap-3 w-full max-w-lg"
        >
            <Input
              type="text"
              placeholder="Cari produk berdasarkan nama..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              icon={<Search className="h-5 w-5" />}
              className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
            />
        </form>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-16 w-full animate-pulse rounded-md bg-gray-200"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="text-red-500 bg-red-50 p-4 rounded-md">
          {(error as Error)?.message || "Gagal memuat data produk."}
        </div>
      ) : !data || data.data.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">
              {search
                ? "Tidak ada produk yang cocok dengan pencarian Anda."
                : "Belum ada produk. Tambah produk pertama Anda."}
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
                          <p className="text-sm font-medium text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      Rp{product.price.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {product.stock}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEdit(product)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setDeleteConfirm({
                              isOpen: true,
                              productId: product.id,
                            })
                          }
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
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 font-medium">
              Menampilkan{" "}
              <span className="text-gray-900">{data.data.length}</span> dari
              total <span className="text-gray-900">{data.total}</span> produk
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Sebelumnya
              </Button>
              <div className="flex items-center justify-center min-w-[6rem] px-2 text-sm font-medium text-gray-700">
                Hal {page} dari {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          ></div>

          {/* Modal Content */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">
                {editingProductId ? "Edit Produk" : "Tambah Produk Baru"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body (Scrollable) */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              {formError && (
                <div className="mb-5 text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 flex items-start gap-3">
                  <div className="mt-0.5">⚠️</div>
                  <div>{formError}</div>
                </div>
              )}

              <form
                id="product-form"
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {/* Kolom Kiri */}
                <div className="space-y-5">
                  <Input
                    label="Nama Produk"
                    name="name"
                    placeholder="Contoh: Sepatu Sneakers Pria"
                    value={form.name}
                    onChange={handleFormChange}
                    className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kategori
                    </label>
                    <CategoryInput
                      value={form.categories}
                      onChange={(categories) => setForm((prev) => ({ ...prev, categories }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deskripsi Produk
                    </label>
                    <textarea
                      name="description"
                      placeholder="Jelaskan detail, bahan, dan keunggulan produk Anda..."
                      value={form.description}
                      onChange={handleFormChange}
                      rows={5}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow resize-none"
                    />
                  </div>
                </div>

                {/* Kolom Kanan */}
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Harga (Rp)"
                      name="price"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={form.price}
                      onChange={handleFormChange}
                      className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      required
                    />
                    <Input
                      label="Stok"
                      name="stock"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={form.stock}
                      onChange={handleFormChange}
                      className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gambar Produk
                    </label>
                    <div className="flex flex-col gap-4">
                      {/* Preview Area */}
                      <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center group hover:border-blue-500 transition-colors">
                        {form.image_url ? (
                          <>
                            <img
                              src={form.image_url}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                            {/* Overlay on hover to change image */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                              <Upload className="h-6 w-6 text-white" />
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-4">
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                            <span className="text-xs text-gray-500 font-medium">Preview</span>
                          </div>
                        )}
                        
                        {/* Hidden File Input covering the entire preview area */}
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                          onChange={handleImageUpload}
                          disabled={uploadMutation.isPending}
                          title="Klik untuk memilih gambar"
                        />
                      </div>
                      
                      {/* Action Area */}
                      <div className="flex flex-col">
                        <div className="mb-3">
                          <h4 className="text-sm font-semibold text-gray-800">Pilih Gambar Baru</h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Format yang didukung: JPG, JPEG, PNG. Ukuran maksimal 7MB.
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          className="relative overflow-hidden cursor-pointer w-fit shadow-sm hover:shadow"
                          disabled={uploadMutation.isPending}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            onChange={handleImageUpload}
                            disabled={uploadMutation.isPending}
                          />
                          <Upload className="h-4 w-4 mr-2 text-blue-600" />
                          <span className="text-gray-700 font-medium">
                            {uploadMutation.isPending ? "Mengunggah..." : (form.image_url ? "Ganti Gambar" : "Jelajahi Berkas")}
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                className="px-6"
              >
                Batal
              </Button>
              <Button
                type="submit"
                form="product-form"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-6 shadow-md hover:shadow-lg transition-shadow"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Menyimpan..."
                  : editingProductId
                    ? "Simpan Perubahan"
                    : "Tambah Produk"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, productId: null })}
        onConfirm={() => {
          if (deleteConfirm.productId) handleDelete(deleteConfirm.productId);
        }}
        title="Hapus Produk"
        message="Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus Produk"
      />
    </div>
  );
}

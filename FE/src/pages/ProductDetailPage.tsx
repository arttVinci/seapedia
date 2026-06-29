import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useProductDetail } from "../hooks/queries/products/useProductDetail";
import { useAddToCart } from "../hooks/mutations/buyer/useAddToCart";
import { ShoppingCart, Store } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { AxiosError } from "axios";
import type { ApiErrorResponse } from "../@types/api/response.types";

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, activeRole } = useAuth();
  const { data: product, isLoading, isError } = useProductDetail(String(id));
  const addToCartMutation = useAddToCart();

  const [quantity, setQuantity] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("desc");

  const handleAddToCart = () => {
    if (!product) return;
    setErrorMsg(null);
    addToCartMutation.mutate(
      { product_id: product.id, quantity },
      {
        onSuccess: () => {
          toast.success("Berhasil ditambahkan ke keranjang!");
        },
        onError: (err: AxiosError<ApiErrorResponse>) => {
          if (err.response?.status === 409) {
            setErrorMsg(
              err.response.data.message || "Konflik: Produk dari toko berbeda.",
            );
          } else {
            toast.error(
              err.response?.data?.message || "Gagal menambahkan ke keranjang",
            );
          }
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-[85rem] px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="w-full h-96 bg-gray-200 rounded-xl"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto max-w-[85rem] px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-xl font-bold md:text-2xl text-gray-900">
          Produk tidak ditemukan
        </h2>
        <Link to="/catalog">
          <button className="mt-4 py-2.5 px-4 inline-flex items-center rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700">
            Kembali ke Katalog
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-[85rem] px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto items-start">
        {/* Left: Product Image */}
        <div>
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-96 object-cover rounded-xl border border-gray-200"
          />
        </div>

        {/* Right: Product Info */}
        <div className="space-y-6 rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm">
          <h2 className="text-lg font-semibold leading-tight text-gray-900">
            {product.name}
          </h2>
          <p className="text-2xl font-semibold text-gray-900">
            Rp{product.price?.toLocaleString("id-ID")}
          </p>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-sm text-gray-500">Stok: {product.stock}</p>

          {/* Seller Info */}
          {product.store && (
            <div className="flex items-center gap-3 border-t border-gray-200 pt-4">
              <Store className="h-8 w-8 text-gray-400" />
              <div>
                <Link
                  to={`/stores/${product.store.id}`}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  {product.store.name}
                </Link>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex justify-between items-center">
              <span>{errorMsg}</span>
              <button
                onClick={() => navigate("/buyer/cart")}
                className="py-1.5 px-3 inline-flex items-center rounded-lg bg-red-600 text-xs font-medium text-white hover:bg-red-700"
              >
                Lihat Keranjang
              </button>
            </div>
          )}

          {token && activeRole === "buyer" && (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 disabled:opacity-50 rounded-l-lg"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  className="w-16 text-center py-2.5 border-x border-gray-300 focus:outline-none focus:ring-0"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val))
                      setQuantity(Math.min(product.stock, Math.max(1, val)));
                  }}
                />
                <button
                  className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 disabled:opacity-50 rounded-r-lg"
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending || product.stock < 1}
                className="w-full inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {addToCartMutation.isPending ? "Menambahkan..." : "+ Keranjang"}
              </button>
            </div>
          )}

          {/* Link to Reviews */}
          <div className="pt-2">
            <Link
              to={`/products/${product.id}/reviews`}
              className="text-blue-600 hover:text-blue-500 font-medium text-sm"
            >
              Lihat Ulasan Produk &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs: Deskripsi | Info Penting */}
      <div className="max-w-6xl mx-auto mt-10">
        <nav className="flex border border-gray-200 rounded-xl overflow-hidden">
          <button
            className={`flex-1 py-4 px-4 text-sm font-medium ${
              activeTab === "desc"
                ? "text-gray-900 border-b-2 border-b-blue-600 bg-white"
                : "text-gray-500 hover:text-gray-700 bg-gray-50"
            }`}
            onClick={() => setActiveTab("desc")}
          >
            Deskripsi
          </button>
          <button
            className={`flex-1 py-4 px-4 text-sm font-medium ${
              activeTab === "info"
                ? "text-gray-900 border-b-2 border-b-blue-600 bg-white"
                : "text-gray-500 hover:text-gray-700 bg-gray-50"
            }`}
            onClick={() => setActiveTab("info")}
          >
            Info Penting
          </button>
        </nav>
        <div className="mt-5">
          {activeTab === "desc" && (
            <p className="text-gray-600 whitespace-pre-wrap">
              {product.description}
            </p>
          )}
          {activeTab === "info" && (
            <p className="text-gray-600">
              Produk hasil laut segar berkualitas. Dipanen dan dikirim langsung
              dari nelayan. Pastikan untuk menyimpan produk di freezer setelah
              diterima.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

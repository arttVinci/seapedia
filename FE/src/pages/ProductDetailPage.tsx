import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useProductDetail } from "../hooks/queries/products/useProductDetail";
import { useAddToCart } from "../hooks/mutations/buyer/useAddToCart";
import { Store, ChevronRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { AxiosError } from "axios";
import type { ApiErrorResponse } from "../@types/api/response.types";

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, activeRole } = useAuth();
  const { data: product, isLoading, isError } = useProductDetail(String(id));
  const addToCartMutation = useAddToCart();

  const [quantity, setQuantity] = useState<number | string>(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("desc");

  const handleAddToCart = () => {
    if (!product) return;
    
    const parsedQuantity = typeof quantity === 'string' ? parseInt(quantity) : quantity;
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      toast.error("Kuantitas tidak valid");
      return;
    }
    
    setErrorMsg(null);
    addToCartMutation.mutate(
      { product_id: product.id, quantity: parsedQuantity },
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
      <div className="container mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 w-full aspect-square bg-gray-200 rounded-xl"></div>
          <div className="lg:col-span-5 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded w-full mt-8"></div>
          </div>
          <div className="lg:col-span-3 w-full h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-16 text-center">
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
    <div className="container mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/catalog" className="text-blue-600 hover:underline">Katalog</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 truncate font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Product Image */}
        <div className="lg:col-span-4">
          <div className="sticky top-24">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full aspect-square object-cover rounded-xl border border-gray-200 bg-white"
            />
          </div>
        </div>

        {/* Center: Product Info */}
        <div className="lg:col-span-5">
          <h1 className="text-xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h1>
          
          <div className="mt-3">
            <p className="text-3xl font-bold text-gray-900">
              Rp{product.price?.toLocaleString("id-ID")}
            </p>
          </div>
          
          {/* Tabs for Detail / Info */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex gap-6">
              <button
                onClick={() => setActiveTab("desc")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm ${
                  activeTab === "desc"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Detail Produk
              </button>
            </nav>
          </div>
          
          <div className="mt-6">
            {activeTab === "desc" && (
              <>
                <div className="text-sm text-gray-600 mb-5 space-y-2">
                  <p>Kondisi: <span className="text-gray-900 font-medium">Baru</span></p>
                  <p>Min. Beli: <span className="text-gray-900 font-medium">1 Buah</span></p>
                  {product.categories && product.categories.length > 0 && (
                    <p>Kategori: <span className="text-blue-600 font-bold cursor-pointer hover:underline">{product.categories.join(', ')}</span></p>
                  )}
                </div>
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-sm">
                  {product.description}
                </p>
              </>
            )}
          </div>

          {/* Store Info */}
          {product.store && (
            <div className="mt-10 border-t border-gray-200 pt-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                   <Store className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">✓</span>
                    <Link
                      to={`/stores/${product.store.id}`}
                      className="text-base font-bold text-gray-900 hover:underline"
                    >
                      {product.store.name}
                    </Link>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Online</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="lg:col-span-3">
          <div className="border border-gray-200 rounded-xl p-4 sticky top-24 shadow-sm bg-white">
            <h3 className="font-bold text-gray-900 mb-4">Atur jumlah dan catatan</h3>
            
            <div className="flex items-center gap-3 mb-5">
              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-300 rounded-lg h-8">
                <button
                  className="px-2.5 h-full text-gray-500 hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center rounded-l-lg"
                  onClick={() => {
                    const q = typeof quantity === 'string' ? parseInt(quantity) : quantity;
                    setQuantity(Math.max(1, (isNaN(q) ? 1 : q) - 1));
                  }}
                  disabled={Number(quantity) <= 1}
                >
                  <span className="text-lg leading-none mt-[-2px]">-</span>
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-12 h-full text-center text-sm border-0 focus:ring-0 p-0"
                  value={quantity}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      setQuantity('');
                      return;
                    }
                    const parsedVal = parseInt(val);
                    if (!isNaN(parsedVal)) {
                      setQuantity(Math.min(product.stock, Math.max(1, parsedVal)));
                    }
                  }}
                />
                <button
                  className="px-2.5 h-full text-blue-600 hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center rounded-r-lg"
                  onClick={() => {
                    const q = typeof quantity === 'string' ? parseInt(quantity) : quantity;
                    setQuantity(Math.min(product.stock, (isNaN(q) ? 0 : q) + 1));
                  }}
                  disabled={Number(quantity) >= product.stock}
                >
                  <span className="text-lg leading-none mt-[-2px]">+</span>
                </button>
              </div>
              <div className="text-sm text-gray-600">
                Stok Total: <span className="font-bold text-gray-900">{product.stock}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-5">
              <span className="text-gray-500 text-sm">Subtotal</span>
              <span className="font-bold text-lg text-gray-900">
                Rp{((product.price || 0) * (typeof quantity === 'number' ? quantity : parseInt(quantity) || 1)).toLocaleString("id-ID")}
              </span>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs">
                <p className="mb-2">{errorMsg}</p>
                <button
                  onClick={() => navigate("/buyer/cart")}
                  className="underline font-medium"
                >
                  Lihat Keranjang
                </button>
              </div>
            )}

            {token && activeRole === "buyer" ? (
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending || product.stock < 1}
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {addToCartMutation.isPending ? "Menambahkan..." : "+ Keranjang"}
                </button>
                <button
                  disabled={product.stock < 1}
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-bold text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50"
                >
                  Beli Langsung
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                Masuk sebagai pembeli untuk memesan.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

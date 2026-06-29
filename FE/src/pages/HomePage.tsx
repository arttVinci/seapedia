import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui";
import { useProducts } from "../hooks/queries/products/useProducts";
import { usePublicStores } from "../hooks/queries/stores/usePublicStores";
import { useAddToCart } from "../hooks/mutations/buyer/useAddToCart";
import { useAuth } from "../contexts/AuthContext";
import {
  Store as StoreIcon,
  Smartphone,
  Laptop,
  ShieldCheck,
  Cpu,
  ShoppingCart,
  Star,
} from "lucide-react";

export function HomePage() {
  const { data, isLoading } = useProducts({ page: 1, size: 8 });
  const { data: stores, isLoading: storesLoading } = usePublicStores();
  const { token, activeRole } = useAuth();
  const addToCartMutation = useAddToCart();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.preventDefault(); // Prevent navigating to detail page
    if (!token) {
      navigate("/login");
      return;
    }
    if (activeRole !== "buyer") {
      alert("Hanya pembeli yang dapat menambahkan ke keranjang.");
      return;
    }
    addToCartMutation.mutate(
      { product_id: productId, quantity: 1 },
      {
        onSuccess: () => alert("Berhasil ditambahkan ke keranjang!"),
        onError: (err: any) => {
          if (err.response?.status === 409) {
            alert(
              err.response.data.message ||
                "Konflik: Produk dari toko berbeda. Kosongkan keranjang terlebih dahulu.",
            );
          } else {
            alert(
              err.response?.data?.message || "Gagal menambahkan ke keranjang",
            );
          }
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative bg-white pt-24 pb-32 sm:pt-32 sm:pb-40 overflow-hidden border-b border-slate-100">
        {/* Abstract tech background elements - Light Theme */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-100/50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-purple-100/50 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-cyan-50/50 blur-3xl"></div>

        <div className="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-8 backdrop-blur-sm shadow-sm transition-transform hover:scale-105">
            <Cpu className="w-4 h-4" />
            <span>Pusat Gadget & Elektronik Terlengkap</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl md:text-7xl drop-shadow-sm">
            Teknologi Terkini, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Di Genggaman Anda
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
            Jelajahi koleksi laptop, handphone, dan aksesoris pintar terbaik.
            Belanja produk original dengan garansi resmi dan harga kompetitif.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/catalog">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 font-semibold px-8 py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-1"
              >
                Mulai Belanja
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-semibold px-8 py-4 rounded-xl shadow-sm transition-all hover:-translate-y-1"
              >
                Daftar Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-start gap-4 hover:border-blue-200 transition-colors group">
            <div className="bg-slate-50 p-3 rounded-xl group-hover:bg-blue-50 transition-colors">
              <Smartphone className="text-blue-600 h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                Produk Original
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Koleksi gadget 100% asli dari berbagai brand ternama.
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-start gap-4 hover:border-blue-200 transition-colors group">
            <div className="bg-slate-50 p-3 rounded-xl group-hover:bg-blue-50 transition-colors">
              <Laptop className="text-blue-600 h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                Pilihan Terlengkap
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Mulai dari laptop gaming hingga ultrabook produktivitas.
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-start gap-4 hover:border-blue-200 transition-colors group">
            <div className="bg-slate-50 p-3 rounded-xl group-hover:bg-blue-50 transition-colors">
              <ShieldCheck className="text-blue-600 h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                Garansi Resmi
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Belanja aman dengan perlindungan garansi resmi dan toko.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Gadget Pilihan
            </h2>
            <p className="text-slate-500 mt-2 text-lg">
              Rekomendasi teknologi terbaru untuk tingkatkan produktivitasmu.
            </p>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors group"
          >
            Lihat Semua{" "}
            <span className="transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
              >
                <div className="bg-slate-200 h-60 w-full"></div>
                <div className="p-5 space-y-4">
                  <div className="h-5 bg-slate-200 rounded-md w-3/4"></div>
                  <div className="h-5 bg-slate-200 rounded-md w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
            {data?.data.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col rounded-[1.25rem] border border-slate-200/75 bg-white p-4 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 mb-4 flex items-center justify-center">
                  <Link
                    to={`/products/${product.id}`}
                    className="block w-full h-full"
                  >
                    <img
                      className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                      src={product.image_url || "/image/handphone-kategori.jpg"}
                      alt={product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/image/iphone-kategori.jpg";
                      }}
                    />
                  </Link>
                </div>

                <div className="flex flex-col flex-grow">
                  {/* Title */}
                  <Link
                    to={`/products/${product.id}`}
                    className="line-clamp-2 text-[15px] font-semibold leading-snug text-slate-800 hover:text-blue-600 transition-colors mb-1"
                  >
                    {product.name}
                  </Link>

                  {/* Rating bintang */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < Math.round(4)
                              ? "fill-amber-400 text-amber-400"
                              : "fill-slate-200 text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-medium text-slate-500">
                      {(4).toFixed(1)}
                      <span className="text-slate-400 ml-0.5">(21)</span>
                    </span>
                  </div>

                  {/* Spacer: dorong harga + tombol ke bawah */}
                  <div className="mt-auto pt-3 flex items-center justify-between gap-2">
                    <p className="text-base font-bold tracking-tight text-slate-900 truncate">
                      Rp{product.price?.toLocaleString("id-ID")}
                    </p>
                    <button
                      onClick={(e) => handleAddToCart(e, product.id)}
                      disabled={addToCartMutation.isPending}
                      className="cursor-pointer disabled:cursor-not-allowed shrink-0 inline-flex justify-center items-center rounded-xl bg-white border border-slate-200 p-2.5 text-slate-900 hover:bg-slate-50 hover:border-slate-300 transition-colors active:scale-95 disabled:opacity-50 shadow-sm"
                      title="Tambah ke Keranjang"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popular Stores Section */}
      <div className="bg-slate-100 py-24 border-t border-slate-200">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Official Store & Distributor
            </h2>
            <p className="text-slate-500 mt-3 text-lg max-w-2xl mx-auto">
              Temukan berbagai toko resmi terpercaya dengan rating tertinggi dan
              pelayanan terbaik.
            </p>
          </div>

          {storesLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white rounded-2xl border border-slate-200 p-6"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 bg-slate-200 rounded-full"></div>
                    <div className="h-5 bg-slate-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : stores && stores.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stores.map((store) => (
                <div
                  key={store.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-slate-100 p-3 rounded-full mr-4 group-hover:bg-blue-600 transition-colors duration-300">
                      <StoreIcon className="h-6 w-6 text-slate-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {store.name}
                    </h3>
                  </div>
                  <p className="text-slate-500 leading-relaxed line-clamp-3">
                    {store.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 max-w-2xl mx-auto shadow-sm">
              <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <StoreIcon className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Belum Ada Toko Aktif
              </h3>
              <p className="text-slate-500 text-lg">
                Toko dan distributor resmi akan segera hadir di platform kami.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

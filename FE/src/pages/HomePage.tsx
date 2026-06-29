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
      navigate('/login');
      return;
    }
    if (activeRole !== 'buyer') {
      alert('Hanya pembeli yang dapat menambahkan ke keranjang.');
      return;
    }
    addToCartMutation.mutate(
      { product_id: productId, quantity: 1 },
      {
        onSuccess: () => alert('Berhasil ditambahkan ke keranjang!'),
        onError: (err: any) => {
          if (err.response?.status === 409) {
            alert(err.response.data.message || 'Konflik: Produk dari toko berbeda. Kosongkan keranjang terlebih dahulu.');
          } else {
            alert(err.response?.data?.message || 'Gagal menambahkan ke keranjang');
          }
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-gray-900 py-24 sm:py-32 overflow-hidden">
        {/* Abstract tech background elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl"></div>
        
        <div className="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-blue-200 text-sm font-medium mb-6 backdrop-blur-sm">
            <Cpu className="w-4 h-4" />
            <span>Pusat Gadget & Elektronik Terlengkap</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl drop-shadow-lg">
            Teknologi Terkini, <br className="hidden sm:block" /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Di Genggaman Anda
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-slate-300 leading-relaxed font-light">
            Jelajahi koleksi laptop, handphone, dan aksesoris pintar terbaik. 
            Belanja produk original dengan garansi resmi dan harga kompetitif.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/catalog">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 font-semibold px-8 py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-1"
              >
                Mulai Belanja
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-slate-600 text-white hover:bg-slate-800 hover:border-slate-500 font-semibold px-8 py-4 rounded-xl transition-all hover:-translate-y-1 backdrop-blur-sm"
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
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {data?.data.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-200 transition-all duration-300"
              >
                <div className="relative h-56 w-full rounded-xl overflow-hidden bg-slate-50 mb-4">
                  <Link to={`/products/${product.id}`} className="block w-full h-full">
                    <img
                      className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      src={product.image_url || "/image/handphone-kategori.jpg"}
                      alt={product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/image/iphone-kategori.jpg";
                      }}
                    />
                  </Link>
                </div>
                
                <div className="flex flex-col flex-grow justify-between">
                  <div>
                    <Link
                      to={`/products/${product.id}`}
                      className="line-clamp-2 text-lg font-bold leading-snug text-slate-900 hover:text-blue-600 transition-colors"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-2 text-xl font-extrabold text-blue-600">
                      Rp{product.price?.toLocaleString("id-ID")}
                    </p>
                  </div>

                  <div className="mt-4 flex gap-2 w-full overflow-hidden">
                    <Link
                      to={`/products/${product.id}`}
                      className="inline-flex justify-center items-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors active:scale-95"
                    >
                      Detail
                    </Link>
                    <button
                      onClick={(e) => handleAddToCart(e, product.id)}
                      disabled={addToCartMutation.isPending}
                      className="flex-1 inline-flex justify-center items-center rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors active:scale-95 disabled:opacity-50"
                      title="Tambah ke Keranjang"
                    >
                      <ShoppingCart className="h-4 w-4 mr-1.5" />
                      Beli
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
              Temukan berbagai toko resmi terpercaya dengan rating tertinggi dan pelayanan terbaik.
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

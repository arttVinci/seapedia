import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "../components/ui";
import { useProducts } from "../hooks/queries/products/useProducts";
import { usePublicStores } from "../hooks/queries/stores/usePublicStores";
import { useAddToCart } from "../hooks/mutations/buyer/useAddToCart";
import { useAuth } from "../contexts/AuthContext";
import { ProductCard } from "../components/product/ProductCard";
import {
  Sparkles,
  Shirt,
  Smartphone,
  Home,
  Apple,
  Baby,
  Dumbbell,
  Gift,
  Truck,
  ShieldCheck,
  Headset,
  Flame,
  StoreIcon,
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
      toast.error("Hanya pembeli yang dapat menambahkan ke keranjang.");
      return;
    }
    addToCartMutation.mutate(
      { product_id: productId, quantity: 1 },
      {
        onSuccess: () => toast.success("Berhasil ditambahkan ke keranjang!"),
        onError: (err: any) => {
          if (err.response?.status === 409) {
            toast.error(
              err.response.data.message ||
                "Konflik: Produk dari toko berbeda. Kosongkan keranjang terlebih dahulu.",
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero / Banner Promo */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-slate-800 -mt-24 pt-44 pb-28 sm:pt-52 sm:pb-36 overflow-hidden">
        {/* Dekorasi lembut */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-blue-300/20 blur-3xl"></div>

        <div className="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/20 text-white text-sm font-semibold mb-8 backdrop-blur-sm shadow-sm transition-transform hover:scale-105">
            <Sparkles className="w-4 h-4" />
            <span>Promo Spesial Setiap Hari</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl drop-shadow-sm">
            Belanja Hemat, <br className="hidden sm:block" />
            <span className="text-blue-200">Pilihan Tanpa Batas</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-blue-50 leading-relaxed">
            Jutaan produk dari fashion, rumah tangga, kecantikan, hingga
            kebutuhan harian. Gratis ongkir & harga terbaik setiap hari!
          </p>
        </div>
      </div>

      {/* Kategori Belanja */}
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-4">
            {[
              { icon: Shirt, label: "Fashion" },
              { icon: Smartphone, label: "Elektronik" },
              { icon: Home, label: "Rumah Tangga" },
              { icon: Sparkles, label: "Kecantikan" },
              { icon: Apple, label: "Makanan" },
              { icon: Baby, label: "Ibu & Anak" },
              { icon: Dumbbell, label: "Olahraga" },
              { icon: Gift, label: "Hobi" },
            ].map((cat) => (
              <Link
                key={cat.label}
                to={`/catalog?category=${cat.label.toLowerCase()}`}
                className="group flex flex-col items-center gap-2 rounded-xl p-3 hover:bg-blue-50 transition-colors"
              >
                <div className="bg-slate-50 p-3 rounded-full group-hover:bg-blue-100 transition-colors">
                  <cat.icon className="text-blue-500 h-6 w-6" />
                </div>
                <span className="text-xs font-semibold text-slate-700 text-center">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Benefit strip */}
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Truck,
              title: "Gratis Ongkir",
              desc: "Min. belanja tertentu ke seluruh Indonesia.",
            },
            {
              icon: ShieldCheck,
              title: "Belanja Aman",
              desc: "Garansi uang kembali 100% bila bermasalah.",
            },
            {
              icon: Headset,
              title: "Layanan 24/7",
              desc: "Customer service siap membantu kapan saja.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-blue-200 transition-colors group"
            >
              <div className="bg-slate-50 p-3 rounded-xl group-hover:bg-blue-50 transition-colors">
                <f.icon className="text-blue-500 h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{f.title}</h3>
                <p className="text-slate-500 text-sm mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Produk Terlaris */}
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Flame className="h-7 w-7 text-blue-500" />
              Produk Rekomendasi
            </h2>
            <p className="text-slate-500 mt-2 text-lg">
              Paling banyak dibeli & disukai pelanggan minggu ini.
            </p>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors group"
          >
            Lihat Semua{" "}
            <span className="transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
              >
                <div className="bg-slate-200 h-44 w-full"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded-md w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {data?.data.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(e: React.MouseEvent) =>
                  handleAddToCart(e, product.id)
                }
                onClick={() => navigate(`/products/${product.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Banner Promo Sekunder */}
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-white">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
            <p className="text-sm font-semibold text-slate-300">FLASH SALE</p>
            <h3 className="text-2xl font-extrabold mt-1">Diskon Hingga 70%</h3>
            <p className="text-blue-50 mt-2 text-sm">
              Buruan sebelum kehabisan!
            </p>
            <Link to="/catalog">
              <Button className="mt-5 bg-white text-slate-900 hover:bg-blue-50 font-semibold rounded-xl">
                Belanja Sekarang
              </Button>
            </Link>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 to-blue-900 p-8 text-white">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
            <p className="text-sm font-semibold text-blue-200">VOUCHER BARU</p>
            <h3 className="text-2xl font-extrabold mt-1">
              Cashback s/d Rp50.000
            </h3>
            <p className="text-blue-100 mt-2 text-sm">
              Klaim voucher untuk pengguna baru.
            </p>
            <Link to="/register">
              <Button className="mt-5 bg-white text-blue-700 hover:bg-blue-50 font-semibold rounded-xl">
                Klaim Voucher
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Toko Pilihan */}
      <div className="bg-slate-100 py-24 border-t border-slate-200">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Toko Pilihan & Terpercaya
            </h2>
            <p className="text-slate-500 mt-3 text-lg max-w-2xl mx-auto">
              Belanja dari penjual terbaik dengan rating tinggi dan pelayanan
              ramah.
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
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {store.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <Star className="h-3.5 w-3.5 fill-blue-500 text-blue-500" />
                        <span>4.9 · Terpercaya</span>
                      </div>
                    </div>
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
                Penjual terpercaya akan segera hadir di platform kami.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Ulasan Aplikasi */}
      <AppReviews />
    </div>
  );
}

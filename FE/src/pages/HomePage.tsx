import { Link } from "react-router-dom";
import { Button } from "../components/ui";
import { useProducts } from "../hooks/queries/products/useProducts";
import { usePublicStores } from "../hooks/queries/stores/usePublicStores";
import { Store as StoreIcon } from "lucide-react";

export function HomePage() {
  const { data, isLoading } = useProducts({ page: 1, size: 4 });
  const { data: stores, isLoading: storesLoading } = usePublicStores();

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 py-20 text-white">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Hasil Laut Segar, <br className="hidden sm:block" /> Langsung ke
            Dapur Anda
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100 sm:mt-6">
            Seapedia menghubungkan Anda dengan nelayan dan penjual ikan terbaik.
            Nikmati ikan laut berkualitas dengan harga terjangkau.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/catalog">
              <Button
                size="lg"
                variant="secondary"
                className="font-semibold text-blue-700"
              >
                Mulai Belanja
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                Daftar Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold md:text-2xl md:leading-tight text-gray-900">
            Produk Pilihan
          </h2>
          <Link
            to="/catalog"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Lihat Semua &rarr;
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-t-lg w-full"></div>
                <div className="space-y-3 py-4 px-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data?.data.map((product) => (
              <div
                key={product.id}
                className="rounded-lg border border-gray-200 bg-white shadow-sm"
              >
                <div className="h-48 w-full">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="mx-auto h-full w-full object-cover rounded-t-lg"
                  />
                </div>
                <div className="p-4">
                  <Link
                    to={`/products/${product.id}`}
                    className="text-lg font-semibold leading-tight text-gray-900 hover:underline line-clamp-2"
                  >
                    {product.name}
                  </Link>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      Rp{product.price?.toLocaleString("id-ID")}
                    </span>
                    <Link
                      to={`/products/${product.id}`}
                      className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700"
                    >
                      Lihat
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Popular Stores Section */}
        <div className="mt-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold md:text-2xl md:leading-tight text-gray-900">
              Toko Populer
            </h2>
          </div>

          {storesLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse border border-gray-200 rounded-lg bg-white p-5">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : stores && stores.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {stores.map((store) => (
                <div
                  key={store.id}
                  className="border border-gray-200 rounded-lg bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <StoreIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {store.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {store.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
              <StoreIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum ada toko.
              </h3>
              <p className="text-gray-500">
                Toko akan muncul di sini setelah penjual mendaftarkan tokonya.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useParams } from "react-router-dom";
import { usePublicStore } from "../hooks/usePublicStore";
import { useStoreProducts } from "../hooks/useStoreProducts";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Store, MapPin, Package } from "lucide-react";
import { Link } from "react-router-dom";

export function StorePage() {
  const { id } = useParams<{ id: string }>();
  const { data: store, isLoading: isStoreLoading, isError: isStoreError } = usePublicStore(id || "");
  const { data: products, isLoading: isProductsLoading } = useStoreProducts(id || "");

  if (isStoreLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-40 bg-gray-200 rounded-lg w-full"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isStoreError || !store) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Toko tidak ditemukan</h2>
        <Link to="/catalog">
          <Button>Kembali ke Katalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Store Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
            <Store size={40} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>
            <p className="mt-2 text-gray-600 max-w-2xl">{store.description || "Belum ada deskripsi."}</p>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Package className="mr-1.5 h-4 w-4" />
                {products ? products.length : 0} Produk
              </span>
              <span className="flex items-center">
                <MapPin className="mr-1.5 h-4 w-4" />
                Indonesia
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Store Products */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Produk Toko</h2>
        
        {isProductsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 animate-pulse bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        ) : !products || products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Toko ini belum memiliki produk.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <Card key={product.id} className="group relative flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-w-3 aspect-h-3 sm:aspect-none bg-gray-200 sm:h-48">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                  />
                </div>
                <CardContent className="flex flex-1 flex-col space-y-2 p-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    <Link to={`/products/${product.id}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-xs text-gray-500">{product.category}</p>
                  <div className="flex-1" />
                  <p className="text-base font-semibold text-gray-900">
                    Rp {product.price.toLocaleString("id-ID")}
                  </p>
                  <p className="text-xs text-gray-500">
                    Stok: {product.stock}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

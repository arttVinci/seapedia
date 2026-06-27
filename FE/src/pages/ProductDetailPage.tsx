import { useParams, Link } from "react-router-dom";
import { useProductDetail } from "../hooks/useProductDetail";
import { Button } from "../components/ui";
import { ShoppingCart, Store, Star } from "lucide-react";

export function ProductDetailPage() {
  const { id } = useParams();
  const { data: product, isLoading, isError } = useProductDetail(Number(id));

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 h-96 bg-gray-200 rounded-lg"></div>
          <div className="w-full md:w-1/2 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Produk tidak ditemukan</h2>
        <Link to="/catalog">
          <Button className="mt-4">Kembali ke Katalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <div className="flex flex-col-reverse">
            <div className="aspect-w-1 aspect-h-1 w-full mt-6">
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover object-center rounded-lg shadow-sm"
              />
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div
                className="space-y-6 text-base text-gray-700"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>

            <div className="mt-6 flex items-center">
              <p className="text-sm text-gray-500 mr-4">
                Kategori: <span className="font-medium text-gray-900">{product.category}</span>
              </p>
              <p className="text-sm text-gray-500">
                Stok: <span className="font-medium text-gray-900">{product.stock}</span>
              </p>
            </div>

            {/* Seller Info */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <div className="flex items-center">
                <Store className="h-8 w-8 text-gray-400 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{product.seller.store_name}</h3>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-600">{product.seller.rating} Rating Toko</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Button size="lg" className="flex-1 flex items-center justify-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Tambah ke Keranjang
              </Button>
            </div>

            {/* Link to Reviews */}
            <div className="mt-8 text-center sm:text-left">
              <Link to={`/products/${product.id}/reviews`} className="text-blue-600 hover:text-blue-500 font-medium text-sm">
                Lihat Ulasan Produk &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

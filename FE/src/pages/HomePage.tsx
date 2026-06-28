import { Link } from "react-router-dom";
import { Button } from "../components/ui";
import { useProducts } from "../hooks/queries/products/useProducts";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "../components/ui";

export function HomePage() {
  const { data, isLoading } = useProducts({ page: 1, size: 4 });

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-blue-600 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Hasil Laut Segar, <br className="hidden sm:block" /> Langsung ke Dapur Anda
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100 sm:mt-6">
            Seapedia menghubungkan Anda dengan nelayan dan penjual ikan terbaik.
            Nikmati ikan laut berkualitas dengan harga terjangkau.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/catalog">
              <Button size="lg" variant="secondary" className="font-semibold text-blue-700">
                Mulai Belanja
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Daftar Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Produk Pilihan
          </h2>
          <Link to="/catalog" className="text-blue-600 hover:text-blue-500 font-medium">
            Lihat Semua &rarr;
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col">
                <div className="bg-gray-200 h-48 rounded-t-lg w-full"></div>
                <div className="flex-1 space-y-4 py-4 px-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {data?.data.map((product) => (
              <Card key={product.id} className="flex flex-col h-full overflow-hidden">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-48 w-full object-cover object-center"
                  />
                </div>
                <CardContent className="flex-1 p-4">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-2">{product.description}</CardDescription>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                  <p className="text-lg font-bold text-gray-900">
                    Rp {product.price.toLocaleString("id-ID")}
                  </p>
                  <Link to={`/products/${product.id}`}>
                    <Button size="sm">Beli</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

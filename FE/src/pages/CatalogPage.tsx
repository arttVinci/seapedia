import { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../hooks/queries/products/useProducts";
import { Button, Input, Card, CardContent, CardFooter, CardTitle, CardDescription } from "../components/ui";
import { Search, Store } from "lucide-react";

export function CatalogPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const perPage = 8;
  const { data, isLoading } = useProducts({ page, size: perPage, title: search });

  const totalPages = data ? Math.ceil(data.total / perPage) : 1;

  const filteredProducts = data?.data ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
        Katalog Produk
      </h1>

      {/* Search */}
      <div className="mb-8 max-w-md">
        <Input
          placeholder="Cari produk..."
          icon={<Search size={18} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-t-lg w-full"></div>
              <div className="space-y-4 py-4 px-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {filteredProducts.map((product) => (
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
                  {product.store && (
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Store size={14} className="mr-1" />
                      {product.store.name}
                    </div>
                  )}
                  <CardDescription className="line-clamp-2 mt-2">{product.description}</CardDescription>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                  <p className="text-lg font-bold text-gray-900">
                    Rp {product.price.toLocaleString("id-ID")}
                  </p>
                  {token && (
                    <Link to={`/products/${product.id}`}>
                      <Button size="sm">Beli</Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

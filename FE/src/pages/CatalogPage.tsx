import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/queries/products/useProducts";
import { useCategories } from "../hooks/queries/categories/useCategories";
import { Store } from "lucide-react";

export function CatalogPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sort, setSort] = useState("newest");
  const perPage = 8;
  const { data, isLoading } = useProducts({ 
    page, 
    size: perPage, 
    name: search, 
    category: selectedCategories.length > 0 ? (selectedCategories.join(",") as any) : undefined 
  });
  const { data: availableCategories = [] } = useCategories();

  // Update local search state when URL changes
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearch(q);
    setPage(1); // Reset page on new search
  }, [searchParams]);

  const totalPages = data ? Math.ceil(data.total / perPage) : 1;
  const filteredProducts = data?.data ?? [];

  const handleApplyFilter = () => {
    setPage(1);
  };

  const handleResetFilter = () => {
    setSearch("");
    setSelectedCategories([]);
    setSort("newest");
    setPage(1);
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => 
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="container mx-auto max-w-[85rem] w-full px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-xl font-bold md:text-2xl md:leading-tight text-gray-900 mb-8">
        Katalog Produk
      </h1>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-10">
        {/* Sidebar Filter */}
        <div className="grid grid-cols-1 gap-10 pr-6 border-r border-gray-200 md:col-span-3">
          <div className="space-y-5">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari Produk
              </label>
              <input
                type="text"
                placeholder="Cari produk..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urutkan
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="py-2.5 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="newest">Terbaru</option>
                <option value="price_asc">Harga Terendah</option>
                <option value="price_desc">Harga Tertinggi</option>
              </select>
            </div>

            {/* Categories */}
            {availableCategories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Kategori
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {availableCategories.map((cat) => (
                    <label key={cat} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Filter Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleApplyFilter}
                className="flex-1 py-2.5 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
              >
                Terapkan
              </button>
              <button
                onClick={handleResetFilter}
                className="flex-1 py-2.5 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-1 md:col-span-7">
          {/* Header */}
          <div className="flex items-center justify-between gap-5 mb-5">
            <div className="font-light text-gray-800">
              Results: {filteredProducts.length} Items
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-lg border border-gray-200 bg-white shadow-sm">
                  <div className="bg-gray-200 h-48 rounded-t-lg w-full"></div>
                  <div className="space-y-3 p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
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
                      {product.store && (
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Store size={14} className="mr-1" />
                          {product.store.name}
                        </div>
                      )}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600 mx-2">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

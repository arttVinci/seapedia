import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/queries/products/useProducts";
import { useCategories } from "../hooks/queries/categories/useCategories";
import { ChevronDown, ChevronUp, Star, Store } from "lucide-react";
import { getDummyProductStats } from "../lib/utils";

const FilterAccordion = ({ title, children, defaultOpen = true }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 py-4">
      <button 
        className="flex w-full items-center justify-between font-bold text-gray-800 text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
      </button>
      {isOpen && <div className="mt-4 space-y-2">{children}</div>}
    </div>
  );
};

export function CatalogPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sort, setSort] = useState("newest");
  const perPage = 15;
  const { data, isLoading } = useProducts({ 
    page, 
    size: perPage, 
    name: search, 
    category: selectedCategories.length > 0 ? (selectedCategories.join(",") as any) : undefined,
    sort
  });
  const { data: availableCategories = [] } = useCategories();

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearch(q);
    
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategories([cat]);
    } else {
      setSelectedCategories([]);
    }
    
    setPage(1);
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
    <div className="container mx-auto max-w-[85rem] w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-5">
        
        {/* Sidebar Filter */}
        <div className="hidden md:block col-span-1 pr-4">
          <h2 className="font-bold text-gray-900 mb-4 text-base">Filter</h2>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            {/* Functional Search */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Cari Produk
              </label>
              <input
                type="text"
                placeholder="Cari..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="py-2 px-3 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <FilterAccordion title="Harga" defaultOpen={true}>
              <label className="flex items-center text-sm text-gray-600 cursor-pointer mb-2">
                <input 
                  type="radio" 
                  name="price_sort"
                  checked={sort === "newest"}
                  onChange={() => {
                    setSort("newest");
                    setPage(1);
                  }}
                  className="mr-2 h-4 w-4 rounded-full border-gray-300 text-blue-600 focus:ring-blue-500" 
                /> Paling Sesuai
              </label>
              <label className="flex items-center text-sm text-gray-600 cursor-pointer mb-2">
                <input 
                  type="radio" 
                  name="price_sort"
                  checked={sort === "price_desc"}
                  onChange={() => {
                    setSort("price_desc");
                    setPage(1);
                  }}
                  className="mr-2 h-4 w-4 rounded-full border-gray-300 text-blue-600 focus:ring-blue-500" 
                /> Tertinggi ke Terendah
              </label>
              <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                <input 
                  type="radio" 
                  name="price_sort"
                  checked={sort === "price_asc"}
                  onChange={() => {
                    setSort("price_asc");
                    setPage(1);
                  }}
                  className="mr-2 h-4 w-4 rounded-full border-gray-300 text-blue-600 focus:ring-blue-500" 
                /> Terendah ke Tertinggi
              </label>
            </FilterAccordion>

            {/* Functional Categories */}
            {availableCategories.length > 0 && (
              <FilterAccordion title="Kategori" defaultOpen={true}>
                <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                  {availableCategories.map((cat) => (
                    <label key={cat} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterAccordion>
            )}

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleApplyFilter}
                className="flex-1 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
              >
                Terapkan
              </button>
              <button
                onClick={handleResetFilter}
                className="flex-1 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-1 md:col-span-3 lg:col-span-4">
          
          {/* Tabs & Header */}
          <div className="border-b border-gray-200 mb-4 pb-2">
            <div className="flex gap-6">
              <button className="text-blue-600 font-bold border-b-2 border-blue-600 pb-2 px-1 -mb-[9px]">
                Produk
              </button>
              
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="text-sm text-gray-700">
              Menampilkan {filteredProducts.length} barang dari total untuk <strong>"{search || selectedCategories.join(", ") || "Semua"}"</strong>
            </div>
            
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-lg border border-gray-200 bg-white shadow-sm p-2">
                  <div className="bg-gray-200 h-32 w-full rounded-md mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {filteredProducts.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center">
                   <div className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-gray-400 text-6xl">😕</span>
                   </div>
                   <h3 className="text-lg font-bold text-gray-900">Oops, produk nggak ditemukan</h3>
                   <p className="text-gray-500 mt-2 max-w-md">Coba kata kunci lain atau ubah filter untuk menemukan produk yang kamu cari.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {filteredProducts.map((product) => (
                    <Link
                      to={`/products/${product.id}`}
                      key={product.id}
                      className="group rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col h-full"
                    >
                      <div className="relative aspect-square w-full bg-white overflow-hidden">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                      </div>
                      <div className="p-2.5 flex flex-col flex-grow">
                        <h3 className="text-[13px] text-gray-800 leading-tight line-clamp-2 mb-1 group-hover:text-blue-600">
                          {product.name}
                        </h3>
                        <div className="font-bold text-gray-900 text-[15px] mb-1">
                          Rp{product.price?.toLocaleString("id-ID")}
                        </div>
                        {product.store && (
                          <div className="flex items-center text-[11px] text-gray-500 mb-1 truncate">
                            <Store size={11} className="mr-1 shrink-0" />
                            <span className="truncate">{product.store.name}</span>
                          </div>
                        )}
                        <div className="flex items-center text-[11px] text-gray-500 mt-auto pt-1">
                          <Star className="text-yellow-400 w-3 h-3 mr-0.5 fill-yellow-400 shrink-0" />
                          <span>{getDummyProductStats(product.id).rating}</span>
                          <span className="mx-1 text-gray-300">•</span>
                          <span>{getDummyProductStats(product.id).sold} terjual</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="py-1.5 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600 mx-2 font-medium">
                    {page} <span className="text-gray-400 mx-1">/</span> {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="py-1.5 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
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

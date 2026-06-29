import { ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "@/@types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (e: React.MouseEvent, product: Product) => void;
  onClick;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

export function ProductCard({
  product,
  onAddToCart,
  onClick,
}: ProductCardProps) {
  return (
    <div
      key={product.id}
      className="group flex flex-col rounded-[1.25rem] border border-slate-200/75 bg-white p-4 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 mb-4 flex items-center justify-center">
        <Link to={`/products/${product.id}`} className="block w-full h-full">
          <img
            className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
            src={product.image_url || "/image/handphone-kategori.jpg"}
            alt={product.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/image/iphone-kategori.jpg";
            }}
          />
        </Link>
      </div>

      <div className="flex flex-col flex-grow">
        {/* Title */}
        <Link
          to={onClick}
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
            {formatPrice(product.price)}
          </p>
          <button
            onClick={(e) => onAddToCart?.(e, product)}
            className="cursor-pointer disabled:cursor-not-allowed shrink-0 inline-flex justify-center items-center rounded-xl bg-white border border-slate-200 p-2.5 text-slate-900 hover:bg-slate-50 hover:border-slate-300 transition-colors active:scale-95 disabled:opacity-50 shadow-sm"
            title="Tambah ke Keranjang"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

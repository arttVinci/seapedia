import { ShoppingCart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Product } from "@/@types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onClick?: (product: Product) => void;
}

const LOW_STOCK_THRESHOLD = 5;

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
  const isOutOfStock = product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= LOW_STOCK_THRESHOLD;

  const finalPrice = product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // mencegah trigger onClick card
    if (!isOutOfStock) onAddToCart?.(product);
  };

  return (
    <Card
      onClick={() => onClick?.(product)}
      className={cn(
        "group flex flex-col overflow-hidden transition-all duration-200",
        "hover:shadow-lg hover:-translate-y-0.5",
        onClick && "cursor-pointer",
        isOutOfStock && "opacity-75",
      )}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className={cn(
            "h-full w-full object-cover transition-transform duration-300",
            "group-hover:scale-105",
            isOutOfStock && "grayscale",
          )}
        />

        {/* Badges overlay */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {isLowStock && (
            <Badge variant="secondary" className="shadow-sm">
              Sisa {product.stock}
            </Badge>
          )}
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <Badge
              variant="outline"
              className="bg-background text-sm font-medium"
            >
              Stok Habis
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
          {product.name}
        </h3>

        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-base font-bold text-foreground">
            {formatPrice(finalPrice)}
          </span>
        </div>
      </CardContent>

      {/* Footer / Action */}
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="w-full"
          size="sm"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isOutOfStock ? "Habis" : "Tambah ke Keranjang"}
        </Button>
      </CardFooter>
    </Card>
  );
}

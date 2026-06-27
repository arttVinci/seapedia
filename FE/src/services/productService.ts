import type { Product, ProductDetail } from "../@types/models";

const MOCK_PRODUCTS: Product[] = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  seller_id: (i % 3) + 1,
  name: `Ikan Segar ${i + 1}`,
  description: `Deskripsi ikan segar kualitas terbaik nomor ${i + 1}.`,
  price: 50000 + i * 10000,
  stock: 10 + i * 5,
  category: i % 2 === 0 ? "Ikan Laut" : "Ikan Tawar",
  image_url: `https://via.placeholder.com/300?text=Ikan+${i + 1}`,
}));

export const productService = {
  getProducts: async (page = 1, limit = 8): Promise<{ data: Product[]; total: number }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      data: MOCK_PRODUCTS.slice(start, end),
      total: MOCK_PRODUCTS.length,
    };
  },

  getProductDetail: async (id: number): Promise<ProductDetail> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const product = MOCK_PRODUCTS.find((p) => p.id === id);
    if (!product) throw new Error("Product not found");

    return {
      ...product,
      seller: {
        id: product.seller_id,
        store_name: `Toko Lautan ${product.seller_id}`,
        rating: 4.5,
      },
    };
  },
};

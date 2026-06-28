import { MOCK_PRODUCTS } from "./productService";
import type { Product, CreateProductPayload, UpdateProductPayload } from "../@types/models";

class SellerProductService {
  private products = MOCK_PRODUCTS; // mutable reference for mock
  private nextId = 13; // since MOCK_PRODUCTS has 12 items

  async getMyProducts(
    sellerId: number,
    page = 1,
    limit = 10,
    name?: string
  ): Promise<{ data: Product[]; total: number }> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filtered = this.products.filter((p) => p.seller_id === sellerId);

    if (name) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return { data, total };
  }

  async createProduct(sellerId: number, payload: CreateProductPayload): Promise<Product> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newProduct: Product = {
      id: this.nextId++,
      seller_id: sellerId,
      name: payload.name,
      description: payload.description || "",
      price: payload.price,
      stock: payload.stock,
      category: payload.category || "Umum",
      image_url: payload.image_url || "https://via.placeholder.com/300?text=Produk",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.products.push(newProduct);
    return newProduct;
  }

  async updateProduct(sellerId: number, id: number, payload: UpdateProductPayload): Promise<Product> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = this.products.findIndex((p) => p.id === id && p.seller_id === sellerId);
    if (index === -1) {
      throw new Error("Produk tidak ditemukan atau bukan milik Anda.");
    }

    const existing = this.products[index];
    const updated: Product = {
      ...existing,
      ...payload,
      updated_at: new Date().toISOString(),
    };

    this.products[index] = updated;
    return updated;
  }

  async deleteProduct(sellerId: number, id: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = this.products.findIndex((p) => p.id === id && p.seller_id === sellerId);
    if (index === -1) {
      throw new Error("Produk tidak ditemukan atau bukan milik Anda.");
    }

    this.products.splice(index, 1);
  }
}

export const sellerProductService = new SellerProductService();

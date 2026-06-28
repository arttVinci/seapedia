import type { Store } from "./store.types";

export interface Product {
  id: string;
  store_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  created_at?: number;
  updated_at?: number;
}

export interface ProductDetail extends Product {
  store: Store;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  price: number;
  stock: number;
  image_url?: string;
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  image_url?: string;
}

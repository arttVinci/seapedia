export interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  subtotal: number;
  image_url?: string;
}

export interface Cart {
  id: string;
  store_id: string | null;
  store_name: string | null;
  items: CartItem[];
  total_items: number;
  total_price: number;
}

export interface AddCartItemPayload {
  product_id: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

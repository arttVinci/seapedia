export interface ProductCart {
  id: number;
  seller_id: number;
  name: string;
  price: number;
  stock: number;
  image_url: string | null;
}

export interface CartItem {
  id: number;
  product: ProductCart;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  seller_id: number;
  items: CartItem[];
  total_items: number;
  total_price: number;
}

export interface AddCartItemPayload {
  product_id: number;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

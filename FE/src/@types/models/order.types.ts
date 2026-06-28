export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
}

export interface StatusHistory {
  id: string;
  order_id: string;
  status: string;
  note: string;
  created_at: number;
}

export interface Order {
  id: string;
  buyer_id: string;
  store_id: string;
  status: string;
  delivery_method: string;
  subtotal: number;
  discount: number;
  delivery_fee: number;
  tax: number;
  final_total: number;
  voucher_id?: string;
  promo_id?: string;
  address_id: string;
  created_simulated_day: number;
  due_simulated_day: number;
  created_at: number;
  updated_at: number;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
  status_histories: StatusHistory[];
}
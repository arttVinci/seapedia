export interface CheckoutPreviewRequest {
  delivery_method: string;
  discount_code?: string;
  address_id: string;
}

export interface CheckoutPreviewResponse {
  subtotal: number;
  discount: number;
  taxable: number;
  tax: number;
  delivery_fee: number;
  final_total: number;
  voucher_applied?: {
    code: string;
    amount: number;
  };
  promo_applied?: {
    code: string;
    amount: number;
  };
}

export interface CheckoutRequest {
  delivery_method: string;
  discount_code?: string;
  address_id: string;
}

export interface CheckoutResponse {
  order_id: string;
  final_total: number;
}
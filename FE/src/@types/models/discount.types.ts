export interface Voucher {
  id: string;
  code: string;
  discount_amount: number;
  expired_at: number;
  remaining_usage: number;
}

export interface Promo {
  id: string;
  code: string;
  discount_amount: number;
  expired_at: number;
}

export interface CreateVoucherPayload {
  code: string;
  discount_amount: number;
  expired_at: number;
  remaining_usage: number;
}

export interface CreatePromoPayload {
  code: string;
  discount_amount: number;
  expired_at: number;
}

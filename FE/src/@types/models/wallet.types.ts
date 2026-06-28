export interface WalletTransaction {
  id: string;
  wallet_id: string;
  type: "topup" | "payment" | "refund" | "income" | "withdraw";
  amount: number;
  description?: string;
  created_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface WalletResponse {
  wallet: Wallet;
  transactions: WalletTransaction[];
}

export interface WalletTopupPayload {
  amount: number;
}

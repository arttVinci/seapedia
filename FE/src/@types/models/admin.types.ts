export interface AdminDashboardStats {
  total_users: number;
  total_stores: number;
  total_products: number;
  total_orders: number;
  total_vouchers: number;
  total_promos: number;
  total_delivery_jobs: number;
  current_simulated_day: number;
}

export interface SimulateNextDayResponse {
  current_simulated_day: number;
  processed_overdue: number;
}

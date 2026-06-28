export interface DriverJobResponse {
  id: string;
  order_id: string;
  store_id: string;
  store_name: string;
  delivery_method: string;
  delivery_fee: number;
  status: string;
  created_at: string;
}

export interface DriverJobDetailResponse extends DriverJobResponse {
  items: Array<{
    id: string;
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
  }>;
  address: {
    name: string;
    phone: string;
    address: string;
    city: string;
    postal_code: string;
    notes?: string;
  };
  status_histories: Array<{
    id: string;
    status: string;
    created_at: string;
  }>;
}

export interface DriverDashboardResponse {
  active_job: DriverJobResponse | null;
  completed_today: number;
  total_earning: number;
  recent_jobs: DriverJobResponse[];
}
